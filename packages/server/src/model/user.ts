import { AsyncReturnType, toError } from "@touhouclouddb/utils"
import { eq, sql } from "drizzle-orm"
import { Effect, identity } from "effect"
import Elysia, { t } from "elysia"
import sharp from "sharp"
import { NewUser, user } from "~/database"
import { User, user_schema } from "~/database/user/typebox"
import { ResponseSchema } from "~/lib/response/schema"
import { db } from "~/service/database"
import { ImageModel } from "./image"
import { OmitColumnFromSchema } from "./utils"

const AVATAR_MIN_SIZE = 10 * 1024 // 10kb
const AVATAR_MAX_SIZE = 2 * 1024 * 1024 // 2mb
export const AVATAR_EXTENSION_NAME = "jpeg"
const VALID_IMAGE_TYPES = ["image/png", "image/jpeg"]
type Parmas = Parameters<typeof db.query.user.findFirst>
type UserColumns = Exclude<Parmas[0], undefined>["columns"]
type With = NonNullable<Parmas[0]>["with"]

export const USER_PROFILE_RETURN_COLUMNS = {
  name: true,
  location: true,
  created_at: true,
  updated_at: true,
} as const satisfies Partial<OmitColumnFromSchema<User, UserColumns>>

export const USER_PROFILE_RETURN_WITH = {
  avatar: {
    columns: {
      filename: true,
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
    return (await db.insert(user).values(data).returning({ id: user.id }))[0]
  }

  static insertM(data: NewUser) {
    return Effect.tryPromise({
      try: () => this.insert(data),
      catch: identity,
    }).pipe(Effect.mapError((e) => ["Insert user failed", toError(e)] as const))
  }

  static async findById(id: number) {
    return db.query.user
      .findFirst({
        where: (fields, op) => op.eq(fields.id, id),
        with: {
          avatar: true,
        },
      })
      .then(flattenUserAvatar)
  }
  static findByIdM(id: number) {
    return Effect.tryPromise(() => this.findById(id))
  }

  static async findByName(username: string): Promise<UserProfile | undefined> {
    return await db.query.user
      .findFirst({
        where: (fields, op) => op.eq(fields.name, username),
        with: {
          avatar: true,
        },
      })
      .then(flattenUserAvatar)
  }

  static async findByNameWithSession(username: string) {
    return await db.query.user
      .findFirst({
        where: (fields, op) => op.eq(fields.name, username),
        with: { avatar: true, session: true },
      })
      .then(flattenUserAvatar)
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

  static async removeAvatar(user: User) {
    if (user.avatar_id) {
      await new ImageModel().deleteByID(user.avatar_id)
    } else {
      throw new Error("User has no avatar")
    }
  }
}

export const user_profile_schema = t.Composite([
  t.Omit(user_schema, ["id", "password", "email", "avatar_id"]),
  t.Object({ avatar: t.Nullable(t.String()) }),
])

export type UserProfile = typeof user_profile_schema.static

export const user_model = new Elysia().decorate("model", UserModel).model({
  "user::avatar": t.Object({
    data: t.File(),
  }),
  "user::profile": ResponseSchema.ok(user_profile_schema),
})

const sim_find = () =>
  db.query.user.findFirst({
    columns: USER_PROFILE_RETURN_COLUMNS,
    with: USER_PROFILE_RETURN_WITH,
  })

type UnflattenedUser = AsyncReturnType<typeof sim_find>
function flattenUserAvatar<T extends UnflattenedUser>(
  user: T,
): T extends undefined ? undefined : T & { avatar: string | null } {
  if (!user)
    return user as unknown as T extends undefined ? undefined
    : T & { avatar: string | null }
  return {
    ...user,
    avatar: !user.avatar ? null : user.avatar.filename,
  } satisfies UserProfile as unknown as T extends undefined ? undefined
  : T & { avatar: string | null }
}

export async function validateAvatar(avatar: File) {
  if (avatar.size > AVATAR_MAX_SIZE) {
    throw new Error("Image too large")
  }

  if (avatar.size < AVATAR_MIN_SIZE) {
    throw new Error("Image too small")
  }

  if (!VALID_IMAGE_TYPES.includes(avatar.type)) {
    throw new Error("Invalid image type")
  }

  const image = sharp(await avatar.arrayBuffer())

  const metadata = await image.metadata()

  const width = metadata.width
  const height = metadata.height

  if (!width || !height || width >= 512 || height >= 512) {
    throw new Error("Invalid image size")
  }

  const aspect_ratio = width / height

  if (!(Math.abs(aspect_ratio - 1) < 0.01)) {
    throw new Error("Image aspect ratio is invalid")
  }

  return await image.toFormat(AVATAR_EXTENSION_NAME).toBuffer()
}
