import { toError } from "@touhouclouddb/utils"
import { sql } from "drizzle-orm"
import { Effect, identity } from "effect"
import { NewUser, user, User } from "~/database"
import { db } from "~/service/database"
import { OmitColumnFromSchema } from "../utils"

type UserColumns = Exclude<
  Parameters<typeof db.query.user.findFirst>[0],
  undefined
>["columns"]

const RETURN_COLUMNS: OmitColumnFromSchema<User, UserColumns> = {
  name: true,
  email: true,
  location: true,
  created_at: true,
  updated_at: true,
} as const

const RETURN_ON_INSERT = {
  name: user.name,
  email: user.email,
  location: user.location,
  created_at: user.created_at,
  updated_at: user.updated_at,
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
    })
  }

  static async findByNameWithSession(username: string) {
    return await db.query.user.findFirst({
      where: (fields, op) => op.eq(fields.name, username),
      with: { session: true },
    })
  }

  static findByNameWithSessionM(username: string) {
    return Effect.tryPromise({
      try: () => this.findByNameWithSession(username),
      catch: (e) => ["Find user failed", toError(e)] as const,
    })
  }
}
