import Elysia, { t } from "elysia"
import { ResponseSchema } from "~/lib/response/schema"
import { UserModel } from "./model"
import { user_profile_schema } from "./util"

export * from "./avatar"
export { user_profile_schema, USER_RETURN_WITH } from "./util"
export type { UserProfile, UserResult } from "./util"

export const user_model = new Elysia().decorate("UserModel", UserModel).model({
  "user::avatar::get": t.File(),
  "user::avatar::post": t.Object({
    data: t.File(),
  }),
  "user::profile": ResponseSchema.ok(user_profile_schema),
})
