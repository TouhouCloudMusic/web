import type { components, operations } from "~/gen"
import { FetchClient } from "~/http"
import type { ApiResult, ApiResultOptional } from "~/shared"
import { adaptApiResult, adaptApiResultOptional } from "~/shared"

export async function findSongById(options: {
	path: operations["find_song_by_id"]["parameters"]["path"]
}): Promise<ApiResultOptional<components["schemas"]["Song"], unknown>> {
	const res = await FetchClient.GET("/song/{id}", {
		params: { path: options.path },
	})

	return adaptApiResultOptional(res)
}

export async function findSongByKeyword(options: {
	query: operations["find_song_by_keyword"]["parameters"]["query"]
}): Promise<ApiResult<components["schemas"]["Song"][], unknown>> {
	const res = await FetchClient.GET("/song", {
		params: { query: options.query },
	})

	return adaptApiResult(res)
}
