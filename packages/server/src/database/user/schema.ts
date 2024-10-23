import { relations } from "drizzle-orm"
import {
  AnyPgColumn,
  foreignKey,
  integer,
  pgTable,
  text,
  timestamp,
  uniqueIndex,
  varchar,
} from "drizzle-orm/pg-core"
import { location } from "../custom_type"
import { image_table } from "../schema"
import { created_and_updated_at } from "../utils/created_and_updated_at"

export const user = pgTable("user", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  name: varchar("name", { length: 16 }).notNull(),
  email: varchar("email", { length: 128 }),
  password: text().notNull(),
  location: location("location"),
  avatar_id: integer().references((): AnyPgColumn => image_table.id, {
    onDelete: "set null",
  }),
  ...created_and_updated_at,
})

export const user_relations = relations(user, ({ one }) => ({
  session: one(session),
  avatar: one(image_table, {
      fields: [user.avatar_id],
      references: [image_table.id],
  }),
}))

export const session = pgTable("session", {
  id: text().primaryKey(),
  user_id: integer()
    .notNull()
    .unique()
    .references(() => user.id, { onDelete: "cascade" }),
  expires_at: timestamp({ withTimezone: true }).notNull(),
})

export const session_relations = relations(session, ({ one }) => ({
  user: one(user, {
    fields: [session.user_id],
    references: [user.id],
  }),
}))
