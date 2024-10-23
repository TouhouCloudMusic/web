import { HashedString } from "@touhouclouddb/utils"
import { createInsertSchema, createSelectSchema } from "drizzle-typebox"
import { t } from "elysia"
import { mapValues } from "radash"
import { image_schema } from "../image/typebox"
import { session, user } from "./schema"

export const user_schema = createSelectSchema(user)
export const user_links_schema = t.Object(
  mapValues(
    {
      avatar: image_schema,
    },
    t.Nullable,
  ),
)
export type User = typeof user_schema.static
export type UserLinks = typeof user_links_schema.static

export const new_user_schema = t.Omit(
  // @ts-ignore
  createInsertSchema(user),
  ["id", "created_at", "updated_at"],
)

export const session_schema = createSelectSchema(session)

export type NewUser = typeof new_user_schema.static & {
  password: HashedString
}
export type Session = typeof session_schema.static
