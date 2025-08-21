import { either as E } from "fp-ts"

import type {
	Release,
	Message,
	FindReleaseByIdError,
	FindReleaseByKeywordError,
	CreateReleaseError,
	UpdateReleaseError,
	UploadReleaseCoverArtError,
} from "~/gen"
import {
	findReleaseById,
	findReleaseByKeyword,
	createRelease,
	updateRelease,
	uploadReleaseCoverArt,
} from "~/gen"
import type { ApiResult, ApiResultOptional } from "~/shared"
import { apiResultFrom, apiResultFromOptional } from "~/shared"

type OptFindOne = Parameters<typeof findReleaseById>
export async function findOne(
	...option: OptFindOne
): Promise<ApiResultOptional<Release, FindReleaseByIdError>> {
	return apiResultFromOptional(await findReleaseById(...option))
}

type OptFindMany = Parameters<typeof findReleaseByKeyword>
export async function findMany(
	...option: OptFindMany
): Promise<ApiResult<Release[], FindReleaseByKeywordError>> {
	return apiResultFrom(await findReleaseByKeyword(...option))
}

type OptCreate = Parameters<typeof createRelease>
export async function create(
	...option: OptCreate
): Promise<ApiResult<Message, CreateReleaseError>> {
	const res = await createRelease(...option)
	if (res.data !== undefined) return E.right(res.data)
	if (res.error) return E.left({ type: "Server", error: res.error })
	return E.left({ type: "Response", error: "Unknown Error" })
}

type OptUpdate = Parameters<typeof updateRelease>
export async function update(
	...option: OptUpdate
): Promise<ApiResult<Message, UpdateReleaseError>> {
	const res = await updateRelease(...option)
	if (res.data !== undefined) return E.right(res.data)
	if (res.error) return E.left({ type: "Server", error: res.error })
	return E.left({ type: "Response", error: "Unknown Error" })
}

type OptUpload = Parameters<typeof uploadReleaseCoverArt>
export async function uploadCoverArt(
	...option: OptUpload
): Promise<ApiResult<Message, UploadReleaseCoverArtError>> {
	const res = await uploadReleaseCoverArt(...option)
	if (res.data !== undefined) return E.right(res.data)
	if (res.error) return E.left({ type: "Server", error: res.error })
	return E.left({ type: "Response", error: "Unknown Error" })
}
