import { createSelectSchema } from "drizzle-typebox"
import { session, user } from "~/database/schema"

export type User = typeof user_schema.static
export const user_schema = createSelectSchema(user)
export type Session = typeof session_schema.static
export const session_schema = createSelectSchema(session)
