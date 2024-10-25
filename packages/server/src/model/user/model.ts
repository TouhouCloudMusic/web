import { AsyncReturnType } from "@touhouclouddb/utils"
import { eq, sql } from "drizzle-orm"
import { Effect } from "effect"
import { NewUser, User, user, user_role_table } from "~/database"
import { USER_ROLE } from "~/database/lookup_tables/role"
import { UserLinks, UserRole } from "~/database/user/typebox"
import { db } from "~/service/database"
import { ImageModel } from "../image"
import { OmitColumnFromSchema } from "../utils"
type Parmas = Parameters<typeof db.query.user.findFirst>
type UserColumns = Exclude<Parmas[0], undefined>["columns"]
type With = NonNullable<Parmas[0]>["with"]

const RETURN_COLUMNS = {
  name: true,
  location: true,
  created_at: true,
  updated_at: true,
} as const satisfies Partial<OmitColumnFromSchema<User, UserColumns>>

export const USER_RETURN_WITH = {
  avatar: true,
  role: {
    with: {
      role: true,
    },
  },
} satisfies With

const RETURN_ON_INSERT = {
  name: user.name,
  location: user.location,
  created_at: user.created_at,
  updated_at: user.updated_at,
} as const satisfies Partial<
  Record<keyof OmitColumnFromSchema<User, UserColumns>, unknown>
>

const sim_find = () =>
  db.query.user.findFirst({
    columns: RETURN_COLUMNS,
    with: USER_RETURN_WITH,
  })

type UnflattenedUser = AsyncReturnType<typeof sim_find>
type FlattenedUser = Omit<NonNullable<UnflattenedUser>, "role"> & {
  role: UserRole[]
}

function flattenUser<T extends UnflattenedUser>(
  user: T,
): T extends undefined ? undefined : T & FlattenedUser {
  // @ts-expect-error
  if (!user) return user
  // @ts-expect-error
  return {
    ...user,
    role: user.role.map((x) => x.role),
  } satisfies FlattenedUser
}

export abstract class UserModel {
  static async exist(username: string): Promise<boolean> {
    const [{ is_exists }] = await db.execute<{ is_exists: boolean }>(sql`
			SELECT EXISTS(
				SELECT 1
				FROM ${user}
				WHERE ${user.name} = ${username}
			) as is_exists;`)

    return is_exists
  }

  static existM(username: string) {
    return Effect.tryPromise({
      try: () => this.exist(username),
      catch(e) {
        console.log(e)
        return "Check user failed" as const
      },
    })
  }

  static async create(data: NewUser): Promise<{ id: number }> {
    return db.transaction(async (tx) => {
      const new_user = (
        await tx.insert(user).values(data).returning({ id: user.id })
      )[0]
      await tx.insert(user_role_table).values({
        user_id: new_user.id,
        role_id: USER_ROLE.User.id,
      })
      return new_user
    })
  }

  static createM(data: NewUser) {
    return Effect.tryPromise({
      try: () => this.create(data),
      catch(e) {
        console.log(e)
        return "Create user failed" as const
      },
    })
  }

  static async findById(id: number): Promise<FlattenedUser | undefined> {
    return db.query.user
      .findFirst({
        where: (fields, op) => op.eq(fields.id, id),
        with: USER_RETURN_WITH,
      })
      .then(flattenUser)
  }
  static findByIdM(id: number) {
    return Effect.tryPromise(() => this.findById(id))
  }

  static async findByName(
    username: string,
  ): Promise<FlattenedUser | undefined> {
    return await db.query.user
      .findFirst({
        where: (fields, op) => op.eq(fields.name, username),
        with: USER_RETURN_WITH,
      })
      .then(flattenUser)
  }

  static async findByNameWithAuthInfo(
    username: string,
  ): Promise<(User & UserLinks) | undefined> {
    return await db.query.user
      .findFirst({
        where: (fields, op) => op.eq(fields.name, username),
        with: { ...USER_RETURN_WITH, session: true },
      })
      .then(flattenUser)
  }

  static findByNameWithAuthInfoM(username: string) {
    return Effect.tryPromise({
      try: () => this.findByNameWithAuthInfo(username),
      catch(e) {
        console.log(e)
        return "Find user failed" as const
      },
    })
  }

  static async updateAvatar({
    user_id,
    image_id,
  }: {
    user_id: number
    image_id: number
  }): Promise<void> {
    const current_avatar_id = await db.query.user
      .findFirst({
        where: (fields, op) => op.eq(fields.id, user_id),
        columns: { avatar_id: true },
      })
      .then((x) => x?.avatar_id)

    if (current_avatar_id) {
      await new ImageModel().deleteByID(current_avatar_id)
    }

    await db
      .update(user)
      .set({ avatar_id: image_id })
      .where(eq(user.id, user_id))
  }

  static async removeAvatar(user: User): Promise<void> {
    if (user.avatar_id) {
      await new ImageModel().deleteByID(user.avatar_id)
    } else {
      throw new Error("User has no avatar")
    }
  }
}
