import { pgTable, serial, varchar } from "drizzle-orm/pg-core"
import { location } from "./custom_type"
import { created_and_updated_at } from "./ts_utils"

export const user = pgTable("user", {
	id: serial("id").primaryKey(),
	name: varchar("name", { length: 128 }).notNull(),
	email: varchar("email", { length: 128 }).notNull(),
	password: varchar("password", { length: 128 }).notNull(),
	location: location("location"),
	...created_and_updated_at,
})
