import type { components, operations } from "~/gen"
import { FetchClient } from "~/http"
import type { ApiResult, ApiResultOptional } from "~/shared"
import { adaptApiResult, adaptApiResultOptional } from "~/shared"

export async function findReleaseById(options: {
	path: operations["find_release_by_id"]["parameters"]["path"]
}): Promise<ApiResultOptional<components["schemas"]["Release"], unknown>> {
	const res = await FetchClient.GET("/release/{id}", {
		params: { path: options.path },
	})

	return adaptApiResultOptional(res)
}

export async function findReleaseByKeyword(options: {
	query: operations["find_release_by_keyword"]["parameters"]["query"]
}): Promise<ApiResult<components["schemas"]["Release"][], unknown>> {
	const res = await FetchClient.GET("/release", {
		params: { query: options.query },
	})

	return adaptApiResult(res)
}
