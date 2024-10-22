import { pgTable } from "drizzle-orm/pg-core"
import { user } from "../user/schema"
import { created_at } from "../utils/created_and_updated_at"

export const image_table = pgTable("image", (t) => ({
  id: t.integer().primaryKey().generatedByDefaultAsIdentity(),
  filename: t.text().notNull(),
  uploaded_by: t
    .integer()
    .references(() => user.id)
    .notNull(),
  ...created_at,
}))
