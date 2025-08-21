import type { components, operations } from "~/gen"
import { FetchClient } from "~/http"
import type { ApiResult, ApiResultOptional } from "~/shared"
import { adaptApiResult, adaptApiResultOptional } from "~/shared"

export async function findEventById(options: {
	path: operations["find_event_by_id"]["parameters"]["path"]
}): Promise<ApiResultOptional<components["schemas"]["Event"], unknown>> {
	const res = await FetchClient.GET("/event/{id}", {
		params: { path: options.path },
	})

	return adaptApiResultOptional(res)
}

export async function findEventByKeyword(options: {
	query: operations["find_event_by_keyword"]["parameters"]["query"]
}): Promise<ApiResult<components["schemas"]["Event"][], unknown>> {
	const res = await FetchClient.GET("/event", {
		params: { query: options.query },
	})

	return adaptApiResult(res)
}
