import * as v from "valibot";


export const ArtistFormSchema = v.object({
	id: v.string(),
	name: v.pipe(
		v.string(),
		v.nonEmpty("Artist name is required"),
		v.maxLength(64, "Artist name is too long")
	),
	type: v.pipe(
		v.string("Artist type is required"),
		v.picklist(["Person", "Group"], "Invalid artist type")
	),
	member: v.array(
		v.union([
			v.object({
				artist_id: v.pipe(
					v.string(),
					v.minLength(1, "Linked member needs an ID")
				),
				type: v.picklist(["Person", "Group"], "Invalid artist type"),
				name: v.pipe(
					v.string(),
					v.maxLength(0, "Linked member dosen't need a name")
				),
				isString: v.literal(false),
			}),
			v.object({
				artist_id: v.pipe(
					v.string(),
					v.maxLength(0, "Text member dosen't need an ID")
				),
				type: v.picklist(["Person", "Group"], "Invalid artist type"),
				name: v.pipe(v.string(), v.minLength(1, "Text member needs a name")),
				isString: v.literal(true),
			}),
		]),
		"Invalid artist"
	),
})
