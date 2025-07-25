import type { OpenApiSchema } from ".."

export * as ReleaseQueryOption from "./query"
export type * from "./schema"

export type ReleaseType = OpenApiSchema["ReleaseType"]
export const RELEASE_TYPES = [
	"Album",
	"Ep",
	"Single",
	"Compilation",
	"Demo",
	"Other",
] as const satisfies ReleaseType[]
