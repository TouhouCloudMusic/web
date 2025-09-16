import * as v from "valibot"

import {
	EntityId,
	EntityIdent,
	NewCorrection,
	NewLocalizedName,
} from "~/domain/shared/schema"

export const NewSongCredit = v.object({
	artist_id: EntityId,
	role_id: EntityId,
})
export type NewSongCredit = v.InferInput<typeof NewSongCredit>

export const NewSong = v.object({
	title: EntityIdent,
	languages: v.array(EntityId),
	localized_titles: v.array(NewLocalizedName),
	credits: v.array(NewSongCredit),
})
export type NewSong = v.InferInput<typeof NewSong>

export const NewSongCorrection = NewCorrection(NewSong)
export type NewSongCorrection = v.InferInput<typeof NewSongCorrection>
