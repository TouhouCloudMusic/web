import { artist, artist_localized_name } from "db/schema"
import { createInsertSchema, createSelectSchema } from "drizzle-typebox"
import { t } from "elysia"

// https://github.com/drizzle-team/drizzle-orm/issues/1810
const text_alias_schema = t.Optional(
	t.Nullable(
		t.Array(
			t.String({
				minLength: 1,
				maxLength: 128,
			})
		)
	)
)

const i18n_name_in = createInsertSchema(artist_localized_name)
const _i18n_name_out = createSelectSchema(artist_localized_name)
const i18n_name_out = t.Omit(_i18n_name_out, ["artist_id"])

const gen_out = createSelectSchema(artist, {
	text_alias: text_alias_schema,
})
const link_props_out = t.Object({
	localized_name: i18n_name_out,
})
export const artist_schema = t.Composite([gen_out, link_props_out])
export type Artist = typeof artist_schema.static

const gen_in = createInsertSchema(artist, {
	text_alias: t.Optional(
		t.Nullable(
			t.Array(
				t.String({
					minLength: 1,
					maxLength: 128,
				})
			)
		)
	),
})

const link_props_in = t.Object({
	localized_name: i18n_name_in,
})
export const new_artist_schema = t.Composite([gen_in, link_props_in])

export type NewArtist = typeof new_artist_schema.static
