import { sql } from "drizzle-orm"
import type { PostgresJsDatabase } from "drizzle-orm/postgres-js"
import { role_table } from "~/database"
import { USER_ROLE } from "~/database/lookup_tables/role"
import {
  language_table,
  release_type_table,
} from "../../src/database/lookup_tables"
import { LANGUAGES } from "../../src/database/lookup_tables/lang"
import { RELEASE_TYPE_ARRAY } from "../../src/database/lookup_tables/release_type"

export async function initLookupTable(db: PostgresJsDatabase<any>) {
  await db
    .insert(language_table)
    .values(LANGUAGES)
    .onConflictDoUpdate({
      target: language_table.id,
      set: {
        name: sql.raw(`excluded.${language_table.name.name}`),
      },
    })

  await db
    .insert(release_type_table)
    .values(RELEASE_TYPE_ARRAY.map((name, index) => ({ id: ++index, name })))
    .onConflictDoUpdate({
      target: release_type_table.id,
      set: {
        name: sql.raw(`excluded.${release_type_table.name.name}`),
      },
    })

  await db
    .insert(role_table)
    .values(Object.values(USER_ROLE))
    .onConflictDoNothing()
}
