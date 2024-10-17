import { pgTable } from "drizzle-orm/pg-core"

export const language_table = pgTable("language", (t) => ({
  id: t.smallint().primaryKey(),
  name: t.text().notNull(),
}))

export const release_type_table = pgTable("release_type", (t) => ({
  id: t.smallint().primaryKey(),
  name: t.text().notNull(),
}))
