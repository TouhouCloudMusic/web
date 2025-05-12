import * as v from "valibot"
import type { Expand, SafeOmit, Eq, If } from "~/types"
import { type ExternalSchema } from "~/types/valibot"

import { type OpenApiSchema } from ".."
import { NewCorrection } from "../correction"
import {
	DateWithPrecision,
	EntityId,
	EntityIdent,
	Location,
	Year,
	NewLocalizedName,
} from "../share/schema"

type o_NewArtistCorrection = OpenApiSchema["NewCorrection_NewArtist"]
type o_NewArtist = o_NewArtistCorrection["data"]

type o_ArtistType = OpenApiSchema["ArtistType"]
type o_NewMembership = OpenApiSchema["NewMembership"]
type o_Tenure = OpenApiSchema["Tenure"]

export const ArtistType = v.union(
	(["Solo", "Multiple", "Unknown"] as const).map((x) => v.literal(x)),
)
export type ArtistType = If<
	Eq<o_ArtistType, v.InferInput<typeof ArtistType>>,
	o_ArtistType,
	never
>
export const Tenure = v.object({
	join_year: v.exactOptional(v.nullable(Year)),
	leave_year: v.exactOptional(v.nullable(Year)),
} satisfies ExternalSchema<o_Tenure>)

type v_Tenure = v.InferInput<typeof Tenure>
export type Tenure = If<Eq<o_Tenure, v_Tenure>, o_Tenure, never>

export const NewMembership = v.object({
	artist_id: EntityId,
	roles: v.array(EntityId),
	tenure: v.array(Tenure),
} satisfies ExternalSchema<o_NewMembership>)
export type NewMembership = v.InferInput<typeof NewMembership>

export type NewArtist = Expand<
	SafeOmit<o_NewArtist, "start_date" | "end_date"> &
		Partial<{
			start_date: DateWithPrecision | null
			end_date: DateWithPrecision | null
		}>
>
export const NewArtist = v.object({
	name: EntityIdent,
	localized_names: v.exactOptional(v.nullable(v.array(NewLocalizedName))),
	artist_type: ArtistType,
	aliases: v.exactOptional(v.nullable(v.array(EntityId))),
	text_aliases: v.exactOptional(v.nullable(v.array(EntityIdent))),
	start_date: v.exactOptional(v.nullable(DateWithPrecision)),
	end_date: v.exactOptional(v.nullable(DateWithPrecision)),
	links: v.exactOptional(v.nullable(v.array(v.pipe(v.string(), v.url())))),
	start_location: v.exactOptional(v.nullable(Location)),
	current_location: v.exactOptional(v.nullable(Location)),
	memberships: v.exactOptional(v.nullable(v.array(NewMembership))),
} satisfies ExternalSchema<NewArtist, o_NewArtist>)

export const NewArtistCorrection = NewCorrection(NewArtist)
export type NewArtistCorrection = v.InferInput<typeof NewArtistCorrection>
export type __NewArtistCorrectionOut = If<
	Eq<o_NewArtistCorrection, v.InferOutput<typeof NewArtistCorrection>>,
	v.InferOutput<typeof NewArtistCorrection>,
	never
>
