import { sha256 } from "@oslojs/crypto/sha2"
import {
  encodeBase32LowerCaseNoPadding,
  encodeHexLowerCase,
} from "@oslojs/encoding"
import { toError } from "@touhouclouddb/utils"
import { eq } from "drizzle-orm"
import { Effect, Option, pipe } from "effect"
import { Session, User } from "~/database"
import { session as session_table } from "~/database/migrate/schema"
import { textEncoder } from "~/lib/singletons"
import { db } from "~/service/database"

const SessionErrorMsg = {
  CreateFailed: "Create session failed",
  UpdateFailed: "Update session failed",
  DeleteFailed: "Delete session failed",
  FindFailed: "Find session failed",
  NotFound: "Session not found",
} as const

export type SessionValidateResult = {
  session: Session
  user: User
}
export type SessionToken = string & { type: "SessionToken" }
export class SessionModel {
  static generateToken(): SessionToken {
    const bytes = new Uint8Array(32)
    crypto.getRandomValues(bytes)
    return encodeBase32LowerCaseNoPadding(bytes) as SessionToken
  }

  static async createSession(
    user_id: number,
    token: SessionToken = this.generateToken(),
  ): Promise<Session> {
    const id = pipe(textEncoder.encode(token), sha256, encodeHexLowerCase)

    const new_session: Session = {
      id,
      user_id,
      expires_at: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30),
    }
    await db.insert(session_table).values(new_session)
    return new_session
  }

  static createSessionM(id: number, token?: SessionToken) {
    return Effect.tryPromise({
      try: () => SessionModel.createSession(id, token),
      catch: (e) => [SessionErrorMsg.CreateFailed, toError(e)] as const,
    })
  }

  private static async findSession(
    token: string,
  ): Promise<SessionValidateResult | undefined> {
    return await db.query.session
      .findFirst({
        where: (field, op) => op.eq(field.id, token),
        with: { user: true },
      })
      .then((x) => {
        if (!x) return x
        const { user, ...session } = x
        return { user, session }
      })
  }

  private static findSessionM(token: string) {
    const findSession = this.findSession.bind(this)

    return Effect.tryPromise({
      try: () => findSession(token),
      catch: (e) => [SessionErrorMsg.FindFailed, toError(e)] as const,
    }).pipe(Effect.map((x) => Option.fromNullable(x)))
  }

  static async updateSession(session: Session) {
    return await db
      .update(session_table)
      .set(session)
      .where(eq(session_table.id, session.id))
  }

  static updateSessionM(session: Session) {
    return Effect.tryPromise({
      try: () => this.updateSession(session),
      catch: () => SessionErrorMsg.UpdateFailed,
    }).pipe(Effect.map(() => {}))
  }

  static async validateToken(
    token: string,
  ): Promise<SessionValidateResult | null> {
    const result = await this.findSession(token)
    if (!result) return null

    const { user, session } = result

    if (Date.now() >= session.expires_at.getTime()) {
      await this.invalidateSession(token)
      return null
    }

    if (Date.now() >= session.expires_at.getTime() - 1000 * 60 * 60 * 24 * 15) {
      session.expires_at = new Date(Date.now() + 1000 * 60 * 60 * 24 * 30)
      await db
        .update(session_table)
        .set({
          expires_at: session.expires_at,
        })
        .where(eq(session_table.id, session.id))
    }
    return { user, session }
  }

  static validateTokenM({ token }: { token: string }) {
    const findSesion = this.findSessionM.bind(this)
    const invalidateSession = this.invalidateSessionM.bind(this)
    const updateSession = this.updateSessionM.bind(this)
    return Effect.gen(function* () {
      const result = yield* findSesion(token)

      if (Option.isNone(result)) return null
      const { user, session } = result.value

      const expries_at = session.expires_at.getTime()

      if (Date.now() >= expries_at) {
        yield* invalidateSession(token)
        return null
      }

      if (Date.now() >= expries_at - 1000 * 60 * 60 * 24 * 15) {
        session.expires_at = new Date(Date.now() + 1000 * 60 * 60 * 24 * 30)
        yield* updateSession(session)
      }
      return { user, session }
    })
  }

  static async invalidateSession(token: string): Promise<void> {
    await db.delete(session_table).where(eq(session_table.id, token))
  }

  static invalidateSessionM(token: string) {
    return Effect.tryPromise({
      try: () => this.invalidateSession(token),
      catch: () => SessionErrorMsg.DeleteFailed,
    })
  }
}
