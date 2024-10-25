import { eq, sql } from "drizzle-orm"
import { Effect } from "effect"
import { NewUser, User, user, user_role_table } from "~/database"
import { USER_ROLE } from "~/database/lookup_tables/role"
import { UserLinks } from "~/database/user/typebox"
import { db } from "~/service/database"
import { ImageModel } from "../image"
import { flattenUser, USER_RETURN_WITH, UserResult } from "./util"

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

  static async findById(id: number): Promise<UserResult | undefined> {
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

  static async findByName(username: string): Promise<UserResult | undefined> {
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
