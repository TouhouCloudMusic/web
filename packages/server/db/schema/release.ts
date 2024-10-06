import {
	date,
	integer,
	pgEnum,
	pgTable,
	primaryKey,
	serial,
	uniqueIndex,
	varchar,
} from "drizzle-orm/pg-core"
import { t } from "elysia"
import { artist } from "./artist"
import { date_precision } from "./enum"
import { localization_language } from "./lang"
import { song } from "./song"
import { created_and_updated_at, credit_cons } from "./ts_utils"

export const release_type = pgEnum("release_type", ["Album", "EP", "Single"])

export const release = pgTable("release", {
	id: serial("id").primaryKey(),
	title: varchar("title", { length: 128 }).notNull(),
	catalog_number: varchar("catalog_number", { length: 16 }),
	recording_date_end_precision: date_precision("recording_date_end_prec"),
	recording_date_end: date("recording_date_end"),
	recording_date_start_precision: date_precision("recording_date_start_prec"),
	recording_date_start: date("recording_date_start"),
	release_date_precision: date_precision("release_date_prec"),
	release_date: date("release_date"),
	release_type: release_type("release_type").notNull(),
	total_disc: integer("total_disc"),
	...created_and_updated_at,
})

export const release_localized_title = pgTable(
	"release_localized_title",
	{
		release_id: integer("release_id")
			.references(() => release.id)
			.notNull(),
		language: localization_language("language").notNull(),
		title: varchar("title", { length: 128 }).notNull(),
	},
	(t) => ({})
)

export const release_artist = pgTable(
	"release_artist",
	{
		release_id: integer("release_id")
			.references(() => release.id)
			.notNull(),
		artist_id: integer("member_id")
			.references(() => artist.id)
			.notNull(),
	},
	(t) => ({
		pk: primaryKey({ columns: [t.release_id, t.artist_id] }),
	})
)

export const release_label = pgTable(
	"release_label",
	{
		release_id: integer("release_id")
			.references(() => release.id)
			.notNull(),
		label_id: integer("label_id")
			.references(() => artist.id)
			.notNull(),
	},
	(t) => ({
		pk: primaryKey({ columns: [t.release_id, t.label_id] }),
	})
)

export const release_track = pgTable("release_track", {
	id: serial("id").primaryKey(),
	release_id: integer("release_id")
		.references(() => release.id)
		.notNull(),
	song_id: integer("song_id")
		.references(() => song.id)
		.notNull(),
	track_order: integer("track_order").notNull(),
	track_number: varchar("track_number", { length: 4 }),
	overwrite_title: varchar("overwrite_title", { length: 128 }),
})

export const release_track_credit = pgTable(
	"release_track_credit",
	{
		...credit_cons(),
		track_id: integer("track_id")
			.references(() => release_track.id)
			.notNull(),
	},
	(t) => ({
		unq: uniqueIndex().on(t.artist_id, t.role_id, t.track_id),
	})
)

export const release_credit = pgTable(
	"release_credit",
	{
		...credit_cons(),
		release_id: integer("release_id")
			.references(() => release.id)
			.notNull(),
	},
	(t) => ({
		unq: uniqueIndex().on(t.artist_id, t.role_id, t.release_id),
	})
)
