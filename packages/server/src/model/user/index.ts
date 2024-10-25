import Elysia, { t } from "elysia"
import { user_links_schema, user_schema } from "~/database/user/typebox"
import { ResponseSchema } from "~/lib/response/schema"
import { UserModel } from "./model"

export * from "./avatar"
export { USER_RETURN_WITH, UserResult } from "./util"
export const user_profile_schema = t.Composite([
  t.Omit(user_schema, ["id", "password", "email", "avatar_id"]),
  t.Omit(user_links_schema, ["session"]),
])
export type UserProfile = typeof user_profile_schema.static

export const user_model = new Elysia().decorate("UserModel", UserModel).model({
  "user::avatar": t.Object({
    data: t.File(),
  }),
  "user::profile": ResponseSchema.ok(user_profile_schema),
})
