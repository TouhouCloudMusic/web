import {
	integer,
	pgTable,
	serial,
	timestamp,
	varchar,
} from "drizzle-orm/pg-core"
import { location } from "./custom_type"
import { created_and_updated_at } from "./utils/created_and_updated_at"

export const user = pgTable("user", {
	id: serial("id").primaryKey(),
	name: varchar("name", { length: 128 }).notNull(),
	email: varchar("email", { length: 128 }).notNull(),
	password: varchar("password", { length: 128 }).notNull(),
	location: location("location"),
	...created_and_updated_at,
})

export const session = pgTable("session", {
	id: serial().primaryKey(),
	user_id: integer()
		.notNull()
		.references(() => user.id),
	expires_at: timestamp().notNull(),
})
