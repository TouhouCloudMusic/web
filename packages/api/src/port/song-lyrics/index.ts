import { either as E } from "fp-ts"

import type {
	SongLyrics,
	Message,
	FindOneSongLyricsError,
	FindManySongLyricsError,
	CreateSongLyricsError,
	UpdateSongLyricsError,
} from "~/gen"
import {
	findOneSongLyrics,
	findManySongLyrics,
	createSongLyrics,
	updateSongLyrics,
} from "~/gen"
import type { ApiResult, ApiResultOptional } from "~/shared"
import { apiResultFrom, apiResultFromOptional } from "~/shared"

type OptFindOne = Parameters<typeof findOneSongLyrics>
export async function findOne(
	...option: OptFindOne
): Promise<ApiResultOptional<SongLyrics, FindOneSongLyricsError>> {
	return apiResultFromOptional(await findOneSongLyrics(...option))
}

type OptFindMany = Parameters<typeof findManySongLyrics>
export async function findMany(
	...option: OptFindMany
): Promise<ApiResult<SongLyrics[], FindManySongLyricsError>> {
	return apiResultFrom(await findManySongLyrics(...option))
}

type OptCreate = Parameters<typeof createSongLyrics>
export async function create(
	...option: OptCreate
): Promise<ApiResult<Message, CreateSongLyricsError>> {
	const res = await createSongLyrics(...option)
	if (res.data !== undefined) return E.right(res.data)
	if (res.error) return E.left({ type: "Server", error: res.error })
	return E.left({ type: "Response", error: "Unknown Error" })
}

type OptUpdate = Parameters<typeof updateSongLyrics>
export async function update(
	...option: OptUpdate
): Promise<ApiResult<Message, UpdateSongLyricsError>> {
	const res = await updateSongLyrics(...option)
	if (res.data !== undefined) return E.right(res.data)
	if (res.error) return E.left({ type: "Server", error: res.error })
	return E.left({ type: "Response", error: "Unknown Error" })
}
