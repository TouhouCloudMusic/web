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
	date_of_start: t.Optional(
		t.String({
			format: "date",
		})
	),
	date_of_start_mask: Schema.date_mask,
	date_of_end: t.Optional(
		t.String({
			format: "date",
		})
	),
	date_of_end_mask: Schema.date_mask,
	start_location: t.Optional(Schema.location),
	current_location: t.Optional(Schema.location),
	end_location: t.Optional(Schema.location),
	str_alias: t.Array(Schema.name),
})

export const artist_result_schema = t.Composite([
	artist_base_schema,
	t.Object({
		alias: artist_base_schema,
		members: t.Composite([
			t.Omit(artist_base_schema, ["artist_type"]),
			t.Object({
				artist_type: t.Literal("Person"),
			}),
		]),
		member_of: t.Composite([
			t.Omit(artist_base_schema, ["artist_type"]),
			t.Object({
				artist_type: t.Literal("Group"),
			}),
		]),
	}),
])

export type ArtistResult = typeof artist_result_schema.static

export const artist_model = new Elysia().model({
	artist: t.Object({
		data: artist_result_schema,
	}),
})

// function findArtistByAppID(id: number, client: Client) {
// 	return client.querySingle(
// 		`# edgeql
// 		SELECT Artist {
// 			**
// 		} FILTER .app_id = ${id}
// 		`
// 	)
// }
