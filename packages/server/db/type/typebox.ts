import { artist } from "db/schema"
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
export const artist_schema = createSelectSchema(artist, {
	text_alias: text_alias_schema,
})

export const new_artist_schema = createInsertSchema(artist, {
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
