import { HashedString } from "@touhouclouddb/utils"
import { createInsertSchema, createSelectSchema } from "drizzle-typebox"
import { t } from "elysia"
import { image_schema } from "../image/typebox"
import { session, user } from "./schema"

const user_link_props = t.Object({
  avatar: t.Optional(image_schema),
})

export const user_schema = t.Composite([
  t.Omit(
    // @ts-ignore
    createSelectSchema(user),
    ["id", "password", "email"],
  ),
  user_link_props,
])
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
