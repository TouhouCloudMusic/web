import createFetchClient from "openapi-fetch"

import type { Expand, RevExactRecursive } from "~/types"

import type { paths, components } from "./openapi"

export type OpenApiSchema = Expand<RevExactRecursive<components["schemas"]>>

export const FetchClient = createFetchClient<RevExactRecursive<paths>>({
	baseUrl: "/api",
})

export * from "./artist"
export * from "./auth"
export * from "./release"
export * from "./shared"
export * from "./user"
