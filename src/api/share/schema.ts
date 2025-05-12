import * as v from "valibot"
import { ENTITY_IDENT_MAX_LEN, ENTITY_IDENT_MIN_LEN } from "~/constant/server"
import type { Eq, If } from "~/types"
import { type ExternalSchema } from "~/types/valibot"

import { type OpenApiSchema } from ".."

export function exactNullable<
	const TWrapped extends v.BaseSchema<unknown, unknown, v.BaseIssue<unknown>>,
>(wrapped: TWrapped) {
	return v.exactOptional(v.nullable(wrapped))
}

export const Year = v.pipe(v.number(), v.integer())

export const EntityIdent = v.pipe(
	v.string(),
	v.minLength(ENTITY_IDENT_MIN_LEN),
	v.maxLength(ENTITY_IDENT_MAX_LEN),
)

export type Location = OpenApiSchema["Location"]

const locationField = exactNullable(v.pipe(v.string(), v.nonEmpty()))
export const Location = v.object({
	country: locationField,
	province: locationField,
	city: locationField,
} satisfies ExternalSchema<Location>)

type _DatePrecision = OpenApiSchema["DatePrecision"]
export const DatePrecision = v.union(
	(["Day", "Month", "Year"] as const).map((x) => v.literal(x)),
)
export type DatePrecision = If<
	Eq<_DatePrecision, v.InferInput<typeof DatePrecision>>,
	_DatePrecision,
	never
>
export type DateWithPrecision = OpenApiSchema["DateWithPrecision"]
export const DateWithPrecision = v.object({
	value: v.date(),
	precision: DatePrecision,
} satisfies ExternalSchema<DateWithPrecision>)

export const EntityId = v.pipe(
	v.number(),
	v.integer(),
	v.minValue(1),
	// i32::MAX
	v.maxValue(2_147_483_647),
)

type NewLocalizedName = OpenApiSchema["NewLocalizedName"]
export const NewLocalizedName = v.object({
	language_id: EntityId,
	name: EntityIdent,
} satisfies ExternalSchema<NewLocalizedName>)
