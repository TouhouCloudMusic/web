import {
	date,
	index,
	integer,
	pgEnum,
	pgTable,
	primaryKey,
	serial,
	uniqueIndex,
	varchar,
} from "drizzle-orm/pg-core"
import { location } from "./custom_type"
import { date_precision } from "./enum"
import { localization_language } from "./lang"
import { created_and_updated_at } from "./ts_utils"

export type ArtistType = (typeof artist_type_enum.enumValues)[number]
export const artist_type_enum = pgEnum("artist_type", ["Person", "Group"])

export const artist = pgTable("artist", {
	id: serial("id").primaryKey(),
	name: varchar("name", { length: 128 }).notNull(),
	artist_type: artist_type_enum("artist_type").notNull(),
	text_alias: varchar("text_alias", { length: 128 }).array(),
	alias_group_id: integer("alias_group_id").references(() => alias_group.id),
	start_date: date("start_date"),
	start_date_precision: date_precision("start_date_prec"),
	end_date: date("end_date"),
	end_date_precision: date_precision("end_date_prec"),
	start_location: location("start_location"),
	current_location: location("current_location"),
	end_location: location("end_location"),
	...created_and_updated_at,
})

export const artist_localized_name = pgTable(
	"artist_localized_name",
	{
		artist_id: integer("artist_id")
			.references(() => artist.id)
			.notNull(),
		language: localization_language("language").notNull(),
		name: varchar("name", { length: 128 }).notNull(),
	},
	(t) => ({
		pk: primaryKey({ columns: [t.artist_id, t.language, t.name] }),
		name_idx: index().on(t.name),
	})
)

export const alias_group = pgTable("alias_group", {
	id: serial("id").primaryKey(),
})

export const group_member = pgTable(
	"group_member",
	{
		member_id: integer("member_id")
			.references(() => artist.id)
			.notNull(),
		group_id: integer("group_id")
			.references(() => artist.id)
			.notNull(),
	},
	(t) => ({
		unique_idx: uniqueIndex().on(t.member_id, t.group_id),
	})
)
