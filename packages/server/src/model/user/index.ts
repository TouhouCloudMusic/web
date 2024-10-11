import { sql } from "drizzle-orm"
import { Either as E, Micro as M, Micro } from "effect"
import { either, option, taskEither as TE } from "fp-ts"
import type { NewUser } from "~/database"
import { user } from "~/database/schema"
import { db } from "~/service/database"

export abstract class UserModel {
  static async exist(username: string) {
    let res = await db.execute<{ is_exists: boolean }>(sql`
			SELECT EXISTS(
				SELECT 1
				FROM ${user}
				WHERE ${user.name} = ${username}
			) as is_exists;`)

    return res[0].is_exists ? true : false
  }

  static existTask(username: string) {
    return TE.tryCatch(async () => {
      let res = await db.execute<{ is_exists: boolean }>(sql`
					SELECT EXISTS(
						SELECT 1
						FROM ${user}
						WHERE ${user.name} = ${username}
					) as is_exists;`)

      return res[0].is_exists ? true : false
    }, either.toError)
  }

  static existMicro(username: string) {
    return Micro.tryPromise({
      try: () => this.exist(username),
      catch: () => "Check user failed" as const,
    })
  }

  static async insert(data: NewUser) {
    return (await db.insert(user).values(data).returning()).at(0)!
  }

  static insertTask(data: NewUser) {
    return TE.tryCatch(() => this.insert(data), either.toError)
  }

  static insertMicro(data: NewUser) {
    return Micro.tryPromise({
      try: () => this.insert(data),
      catch: () => "Insert user failed" as const,
    })
  }
  static async findByName(username: string) {
    return await db.query.user.findFirst({
      where: (fields, op) => op.eq(fields.name, username),
    })
  }
}
