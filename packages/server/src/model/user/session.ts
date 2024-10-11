import { eq } from "drizzle-orm"
import { Micro } from "effect"
import type { Session, User } from "~/database"
import { session as session_table } from "~/database/schema"
import { db } from "~/service/database"

const FailedToCreateSessionErrMsg = "Failed to create session" as const
const FailedToDeleteSessionMsg = "Failed to delete session" as const
export type SessionToken = string & { type: "SessionToken" }
export class SessionModel {
	static generateSessionToken(): SessionToken {
		return crypto.randomUUID() as SessionToken
	}

	static async createSession(
		token: SessionToken,
		user_id: number
	): Promise<Session> {
		const new_session: Session = {
			id: token,
			user_id,
			expires_at: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30),
		}
		await db.insert(session_table).values(new_session)
		return new_session
	}

	static createSessionMicro({ user }: { user: { id: number } }) {
		return Micro.tryPromise({
			try: () => this.createSession(this.generateSessionToken(), user.id),
			catch: () => FailedToCreateSessionErrMsg,
		})
	}

	static async validateToken({
		token,
	}: {
		token: string
	}): Promise<{ session: Session; user: User } | null> {
		const result = await db.query.session.findFirst({
			where: (field, op) => op.eq(field.id, token),
			with: { user: true },
		})
		if (!result) return null

		const { user, ...session } = result

		if (Date.now() >= session.expires_at.getTime()) {
			await db.delete(session_table).where(eq(session_table.id, session.id))
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
		return { session, user }
	}

	static async invalidateSession(token: string): Promise<void> {
		await db.delete(session_table).where(eq(session_table.id, token))
	}
}

abstract class SessionError {
	static FailedToCreateSession() {
		return new FailedToCreateSessionError()
	}

	static FailedToDeleteSession() {
		return new FailedToDeleteSessionError()
	}
}

class FailedToCreateSessionError extends Error {
	constructor() {
		super(FailedToCreateSessionErrMsg)
	}
}

class FailedToDeleteSessionError extends Error {
	constructor() {
		super(FailedToDeleteSessionMsg)
	}
}
