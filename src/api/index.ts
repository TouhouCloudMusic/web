import createFetchClient from "openapi-fetch"

import type { paths, components } from "./openapi"

export type OpenApiSchema = components["schemas"]

export const FetchClient = createFetchClient<paths>({
	baseUrl: "/api",
})

export type { Artist } from "./artist"
export * from "./auth"
export * from "./language"
export * from "./release"
export * from "./shared"
export * from "./user"
