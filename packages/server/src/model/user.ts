import { toError } from "@touhouclouddb/utils"
import { eq, sql } from "drizzle-orm"
import { Effect, identity } from "effect"
import Elysia, { t } from "elysia"
import { NewUser, user, User } from "~/database"
import { db } from "~/service/database"
import { ImageModel } from "./image"
import { OmitColumnFromSchema } from "./utils"
const AVATAR_MIN_SIZE = "10k"
const AVATAR_MAX_SIZE = "2m"
type Parmas = Parameters<typeof db.query.user.findFirst>
type UserColumns = Exclude<Parmas[0], undefined>["columns"]
type With = NonNullable<Parmas[0]>["with"]

const RETURN_COLUMNS = {
  name: true,
  location: true,
  created_at: true,
  updated_at: true,
} as const satisfies OmitColumnFromSchema<User, UserColumns>

const RETURN_WITH = {
  avatar: true,
} satisfies With

const RETURN_ON_INSERT = {
  name: user.name,
  location: user.location,
  created_at: user.created_at,
  updated_at: user.updated_at,
  avatar_id: user.avatar_id,
  avatar: undefined,
} as const satisfies Record<
  keyof OmitColumnFromSchema<User, UserColumns>,
  unknown
>

export abstract class UserModel {
  static async exist(username: string) {
    let res = await db.execute<{ is_exists: boolean }>(sql`
			SELECT EXISTS(
				SELECT 1
				FROM ${user}
				WHERE ${user.name} = ${username}
			) as is_exists;`)

    return res[0].is_exists
  }

  static existM(username: string) {
    return Effect.tryPromise({
      try: () => this.exist(username),
      catch: (e) => ["Check user failed", toError(e)] as const,
    })
  }

  static async insert(data: NewUser) {
    return (await db.insert(user).values(data).returning()).at(0)!
  }

  static insertM(data: NewUser) {
    return Effect.tryPromise({
      try: () => this.insert(data),
      catch: identity,
    }).pipe(Effect.mapError((e) => ["Insert user failed", toError(e)] as const))
  }

  static async findByName(username: string) {
    return await db.query.user.findFirst({
      where: (fields, op) => op.eq(fields.name, username),
      columns: RETURN_COLUMNS,
      with: RETURN_WITH,
    })
  }

  static async findByNameWithSession(username: string) {
    return await db.query.user.findFirst({
      where: (fields, op) => op.eq(fields.name, username),
      with: { ...RETURN_WITH, session: true },
    })
  }

  static findByNameWithSessionM(username: string) {
    return Effect.tryPromise({
      try: () => this.findByNameWithSession(username),
      catch: (e) => ["Find user failed", toError(e)] as const,
    })
  }

  static async updateAvatar({
    user_id,
    image_id,
  }: {
    user_id: number
    image_id: number
  }) {
    const current_avatar_id = await db.query.user
      .findFirst({
        where: (fields, op) => op.eq(fields.id, user_id),
        columns: { avatar_id: true },
      })
      .then(async (x) => {
        if (x) return x.avatar_id
        return x
      })

    if (current_avatar_id) {
      await new ImageModel().deleteByID(current_avatar_id)
    }

    await db
      .update(user)
      .set({ avatar_id: image_id })
      .where(eq(user.id, user_id))
  }
}

export const user_model = new Elysia().decorate("model", UserModel).model({
  "user::avatar": t.Object({
    data: t.File({
      maxSize: AVATAR_MAX_SIZE,
      minSize: AVATAR_MIN_SIZE,
      type: "image/*",
    }),
  }),
})
