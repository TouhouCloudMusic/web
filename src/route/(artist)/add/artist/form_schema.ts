import * as v from "valibot"

export const ArtistFormSchema = v.object({
	id: v.string(),
	name: v.pipe(
		v.string(),
		v.nonEmpty("Artist name is required"),
		v.maxLength(64, "Artist name is too long")
	),
	type: v.picklist(["Person", "Group"], "Invalid artist type"),
	member: v.optional(
		v.array(
			v.object({
				artist_id: v.string(),
				type: v.picklist(["Person", "Group"], "Invalid artist type"),
				name: v.string(),
				isString: v.boolean(),
				group_member_id: v.string(),
			}),
			"Invalid artist"
		),
		[]
	),
})
