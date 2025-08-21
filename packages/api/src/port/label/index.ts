import type { components, operations } from "~/gen"
import { FetchClient } from "~/http"
import type { ApiResult, ApiResultOptional } from "~/shared"
import { adaptApiResult, adaptApiResultOptional } from "~/shared"

export async function findLabelById(options: {
	path: operations["find_label_by_id"]["parameters"]["path"]
}): Promise<ApiResultOptional<components["schemas"]["Label"], unknown>> {
	const res = await FetchClient.GET("/label/{id}", {
		params: { path: options.path },
	})

	return adaptApiResultOptional(res)
}

export async function findLabelByKeyword(options: {
	query: operations["find_label_by_keyword"]["parameters"]["query"]
}): Promise<ApiResult<components["schemas"]["Label"][], unknown>> {
	const res = await FetchClient.GET("/label", {
		params: { query: options.query },
	})

	return adaptApiResult(res)
}
