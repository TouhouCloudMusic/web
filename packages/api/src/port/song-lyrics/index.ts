import type { components, operations } from "~/gen"
import { FetchClient } from "~/http"
import type { ApiResult, ApiResultOptional } from "~/shared"
import { adaptApiResult, adaptApiResultOptional } from "~/shared"

export async function findOneSongLyrics(options: {
	query: operations["find_one_song_lyrics"]["parameters"]["query"]
}): Promise<ApiResultOptional<components["schemas"]["SongLyrics"], unknown>> {
	const res = await FetchClient.GET("/song-lyrics", {
		params: { query: options.query },
	})

	return adaptApiResultOptional(res)
}

export async function findManySongLyrics(options: {
	query: operations["find_many_song_lyrics"]["parameters"]["query"]
}): Promise<ApiResult<components["schemas"]["SongLyrics"][], unknown>> {
	const res = await FetchClient.GET("/song-lyrics/many", {
		params: { query: options.query },
	})

	return adaptApiResult(res)
}
