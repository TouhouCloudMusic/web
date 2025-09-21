import * as v from "valibot"

import { EntityId, EntityIdent, NewCorrection } from "~/domain/shared/schema"

export const TagType = v.union(
	(["Descriptor", "Genre", "Movement", "Scene"] as const).map((x) =>
		v.literal(x),
	),
)
export type TagType = v.InferInput<typeof TagType>

export const TagRelationType = v.union(
	(["Inherit", "Derive"] as const).map((x) => v.literal(x)),
)
export type TagRelationType = v.InferInput<typeof TagRelationType>

export const NewTagRelation = v.object({
	related_tag_id: v.message(EntityId, "Tag not selected"),
	type: TagRelationType,
})
export type NewTagRelation = v.InferInput<typeof NewTagRelation>

export const NewTag = v.object({
	name: v.message(EntityIdent, "Name is required and must be non-empty"),
	type: TagType,
	short_description: v.nullish(v.string()),
	description: v.nullish(v.string()),
	alt_names: v.nullish(v.array(EntityIdent)),
	relations: v.nullish(v.array(NewTagRelation)),
})
export type NewTag = v.InferInput<typeof NewTag>

export const NewTagCorrection = NewCorrection(NewTag)
export type NewTagCorrection = v.InferInput<typeof NewTagCorrection>
