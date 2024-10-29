import { eq, type SQL, sql } from "drizzle-orm"
import { Effect } from "effect"
import Elysia, { t } from "elysia"
import {
  type NewUser,
  role_table,
  type User,
  user_role_table,
  user as user_table,
} from "~/database"
import { USER_ROLE, type UserRoleUnion } from "~/database/lookup_tables/role"
import { type Session } from "~/database/user/typebox"
import { ResponseSchema } from "~/lib/response/schema"
import { db } from "~/service/database"
import { ImageModel } from "../image"
import { select_user_query, select_user_with_session } from "./query"
import {
  flattenUser,
  user_profile_schema,
  USER_RETURN_WITH,
  type UserResult,
} from "./util"

export abstract class UserModel {
  static async exist(username: string): Promise<boolean> {
    const [{ is_exists }] = await db.execute<{ is_exists: boolean }>(sql`
			SELECT EXISTS(
				SELECT 1
				FROM ${user_table}
				WHERE ${user_table.name} = ${username}
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
        await tx
          .insert(user_table)
          .values(data)
          .returning({ id: user_table.id })
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

  static async findById(id: number): Promise<UserResult | undefined> {
    return (
      await db
        .with(select_user_query)
        .select()
        .from(select_user_query)
        .where(eq(select_user_query.id, id))
    )[0]
  }
  static findByIdM(id: number) {
    return Effect.tryPromise(() => this.findById(id))
  }

  static async findByName(username: string): Promise<UserResult | undefined> {
    return (
      await db
        .with(select_user_query)
        .select()
        .from(select_user_query)
        .where(eq(select_user_query.name, username))
    )[0]
  }

  static async findByNameWithAuthInfo(username: string): Promise<
    | {
        user: UserResult
        session: Session | null
      }
    | undefined
  > {
    const data = await select_user_with_session.where(
      eq(user_table.name, username),
    )

    if (!data.length) return
    const { session, ...user } = data[0]
    return { user, session: session }
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
      .update(user_table)
      .set({ avatar_id: image_id })
      .where(eq(user_table.id, user_id))
  }

  static async removeAvatar(user: User): Promise<void> {
    if (user.avatar_id) {
      await new ImageModel().deleteByID(user.avatar_id)
    } else {
      throw new Error("User has no avatar")
    }
  }

  static async checkRole(
    user_id: number,
    type: "any of" | "all of",
    roles: UserRoleUnion[],
  ): Promise<boolean> {
    let logical_sql: SQL

    if (type === "any of") {
      logical_sql = sql`AND ${role_table.name} IN ${roles}`
    } else {
      const array_expr = sql.raw(
        `ARRAY[${roles.map((x) => `'${x}'`).join(",")}]`,
      )
      logical_sql = sql`HAVING ARRAY_AGG(${role_table.name}) @> ${array_expr}`
    }

    const res = await db.execute<{ has_role: boolean }>(sql`
      SELECT EXISTS (
        SELECT 1
        FROM ${user_role_table}
        JOIN ${role_table} ON ${user_role_table.role_id} = ${role_table.id}
        WHERE ${user_role_table.user_id} = ${user_id}
        ${logical_sql}
      ) AS has_role;`)

    return res[0].has_role
  }
}

export const user_model = new Elysia().decorate("UserModel", UserModel).model({
  "user::avatar::get": t.File(),
  "user::avatar::post": t.Object({
    data: t.File(),
  }),
  "user::profile": ResponseSchema.ok(user_profile_schema),
})
