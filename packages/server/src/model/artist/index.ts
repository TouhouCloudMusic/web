import Elysia, { t } from "elysia"
import { Schema } from "~/lib/schema"

const artist_base_schema = t.Object({
	id: Schema.id,
	app_id: Schema.app_id,
	name: Schema.name,
	artist_type: t.Union([t.Literal("Person"), t.Literal("Group")], {
		error: "Invalid artist type",
	}),
	localized_name: t.Array(
		t.Object({
			language: Schema.language,
			name: Schema.name,
		})
	),
	date_of_start: t.Nullable(
		t.String({
			format: "date",
		})
	),
	date_of_start_mask: t.Nullable(Schema.date_mask),
	date_of_end: t.Nullable(
		t.String({
			format: "date",
		})
	),
	date_of_end_mask: t.Nullable(Schema.date_mask),
	start_location: t.Nullable(Schema.location),
	current_location: t.Nullable(Schema.location),
	end_location: t.Nullable(Schema.location),
	str_alias: t.Nullable(t.Array(Schema.name)),
})

export const artist_result_schema = t.Composite([
	artist_base_schema,
	t.Object({
		alias: t.Array(artist_base_schema),
		members: t.Array(
			t.Composite([
				t.Omit(artist_base_schema, ["artist_type"]),
				t.Object({
					artist_type: t.Literal("Person"),
				}),
			])
		),
		member_of: t.Array(
			t.Composite([
				t.Omit(artist_base_schema, ["artist_type"]),
				t.Object({
					artist_type: t.Literal("Group"),
				}),
			])
		),
	}),
])

export type ArtistResult = typeof artist_result_schema.static

export const artist_model = new Elysia().model({
	"artist::findByID": Schema.ok(t.Array(artist_result_schema)),
})
