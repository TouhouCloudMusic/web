import type { components, operations } from "~/gen"
import { FetchClient } from "~/http"
import type { ApiResult, ApiResultOptional } from "~/shared"
import { adaptApiResult, adaptApiResultOptional } from "~/shared"

export async function findTagById(options: {
	path: operations["find_tag_by_id"]["parameters"]["path"]
}): Promise<ApiResultOptional<components["schemas"]["Tag"], unknown>> {
	const res = await FetchClient.GET("/tag/{id}", {
		params: { path: options.path },
	})

	return adaptApiResultOptional(res)
}

export async function findTagByKeyword(options: {
	query: operations["find_tag_by_keyword"]["parameters"]["query"]
}): Promise<ApiResult<components["schemas"]["Tag"][], unknown>> {
	const res = await FetchClient.GET("/tag", {
		params: { query: options.query },
	})

	return adaptApiResult(res)
}
