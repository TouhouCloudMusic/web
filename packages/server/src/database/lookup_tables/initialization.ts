import { sql } from "drizzle-orm"
import { db } from "~/service/database"
import { language_table, release_type_table } from "."
import { LANGUAGES } from "./lang"
import { RELEASE_TYPE } from "./release_type"

async function main() {
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
    .values(Object.values(RELEASE_TYPE))
    .onConflictDoUpdate({
      target: release_type_table.id,
      set: {
        name: sql.raw(`excluded.${release_type_table.name.name}`),
      },
    })
}

await main()

process.exit(0)
