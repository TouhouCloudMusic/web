import type { components, operations } from "~/gen"
import { FetchClient } from "~/http"
import type { ApiResultOptional } from "~/shared"
import { adaptApiResultOptional } from "~/shared"

export async function profile(): Promise<
	ApiResultOptional<components["schemas"]["UserProfile"], unknown>
> {
	const res = await FetchClient.GET("/profile", {})

	return adaptApiResultOptional(res)
}

export async function profileWithName(options: {
	path: operations["profile_with_name"]["parameters"]["path"]
}): Promise<ApiResultOptional<components["schemas"]["UserProfile"], unknown>> {
	const res = await FetchClient.GET("/profile/{name}", {
		params: { path: options.path },
	})

	return adaptApiResultOptional(res)
}

// Legacy aliases
export const current = profile
export const findByName = profileWithName
