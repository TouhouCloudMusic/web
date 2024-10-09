import { eq } from "drizzle-orm"
import { Session, User } from "~/database"
import { session as session_table } from "~/database/schema"

import { db } from "../database"
export type SessionToken = string & { type: "SessionToken" }

export type SessionValidationResult = { session: Session; user: User } | null

export class SessionModel {
	constructor() {}

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

	static async validateSessionToken(
		token: string
	): Promise<SessionValidationResult> {
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
