import { HashedString } from "@touhouclouddb/utils"
import { createInsertSchema, createSelectSchema } from "drizzle-typebox"
import { t } from "elysia"
import { session, user } from "./schema"

const _user_schema = createSelectSchema(user)
export const user_schema = t.Omit(_user_schema, ["id", "password", "email"])
export type User = typeof user_schema.static

const _new_user_schema = createInsertSchema(user)
export const new_user_schema = t.Omit(_new_user_schema, [
  "id",
  "created_at",
  "updated_at",
])
export type NewUser = typeof new_user_schema.static & {
  password: HashedString
}

export const session_schema = createSelectSchema(session)
export type Session = typeof session_schema.static
