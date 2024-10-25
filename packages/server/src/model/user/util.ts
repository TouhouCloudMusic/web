import { AsyncReturnType, SafeOmit } from "@touhouclouddb/utils"
import { User, UserLinks } from "~/database/user/typebox"
import { db } from "~/service/database"

type Parmas = Parameters<typeof db.query.user.findFirst>

export const USER_RETURN_WITH = {
  avatar: true,
  role: {
    with: {
      role: true,
    },
  },
} satisfies NonNullable<Parmas[0]>["with"]

// type UserColumns = Exclude<Parmas[0], undefined>["columns"]

// const RETURN_ON_INSERT = {
//   name: user.name,
//   location: user.location,
//   created_at: user.created_at,
//   updated_at: user.updated_at,
// } as const satisfies Partial<
//   Record<keyof OmitColumnFromSchema<User, UserColumns>, unknown>
// >

const sim_find = () =>
  db.query.user.findFirst({
    with: USER_RETURN_WITH,
  })

export type UnflattenedUser = AsyncReturnType<typeof sim_find>
export type UserResult = User & SafeOmit<UserLinks, "session">

export function flattenUser<T extends UnflattenedUser>(
  user: T,
): T extends undefined ? undefined : Omit<T, "role"> & Pick<UserLinks, "role">
export function flattenUser<T extends UnflattenedUser>(user: T) {
  if (user)
    return {
      ...user,
      role: user.role.map((x) => x.role),
    } satisfies Omit<T, "role"> & Pick<UserLinks, "role">
}
