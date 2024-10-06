import { artist } from "db/schema"
import { createInsertSchema, createSelectSchema } from "drizzle-typebox"

export type Artist = typeof Artist.static
export const Artist = createSelectSchema(artist)
export type NewArtist = typeof NewArtist.static
export const NewArtist = createInsertSchema(artist)
