import { createInsertSchema, createSelectSchema } from "drizzle-typebox"
import { song } from "./schema"

export const song_schema = createSelectSchema(song)

export const new_song_schema = createInsertSchema(song)

export type Song = typeof song_schema.static
export type NewSong = typeof new_song_schema.static
