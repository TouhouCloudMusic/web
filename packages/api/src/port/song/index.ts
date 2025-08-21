import { either as E } from "fp-ts"

import type {
	Song,
	Message,
	FindSongByIdError,
	FindSongByKeywordError,
	CreateSongError,
	UpdateSongError,
} from "~/gen"
import { findSongById, findSongByKeyword, createSong, updateSong } from "~/gen"
import type { ApiResult, ApiResultOptional } from "~/shared"
import { apiResultFrom, apiResultFromOptional } from "~/shared"

type OptFindOne = Parameters<typeof findSongById>
export async function findOne(
	...option: OptFindOne
): Promise<ApiResultOptional<Song, FindSongByIdError>> {
	return apiResultFromOptional(await findSongById(...option))
}

type OptFindMany = Parameters<typeof findSongByKeyword>
export async function findMany(
	...option: OptFindMany
): Promise<ApiResult<Song[], FindSongByKeywordError>> {
	return apiResultFrom(await findSongByKeyword(...option))
}

type OptCreate = Parameters<typeof createSong>
export async function create(
	...option: OptCreate
): Promise<ApiResult<Message, CreateSongError>> {
	const res = await createSong(...option)
	if (res.data !== undefined) return E.right(res.data)
	if (res.error) return E.left({ type: "Server", error: res.error })
	return E.left({ type: "Response", error: "Unknown Error" })
}

type OptUpdate = Parameters<typeof updateSong>
export async function update(
	...option: OptUpdate
): Promise<ApiResult<Message, UpdateSongError>> {
	const res = await updateSong(...option)
	if (res.data !== undefined) return E.right(res.data)
	if (res.error) return E.left({ type: "Server", error: res.error })
	return E.left({ type: "Response", error: "Unknown Error" })
}
