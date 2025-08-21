import { either as E } from "fp-ts"

import type {
	Tag,
	Message,
	FindTagByIdError,
	FindTagByKeywordError,
	CreateTagError,
	UpsertTagCorrectionError,
} from "~/gen"
import {
	findTagById,
	findTagByKeyword,
	createTag,
	upsertTagCorrection,
} from "~/gen"
import type { ApiResult, ApiResultOptional } from "~/shared"
import { apiResultFrom, apiResultFromOptional } from "~/shared"

type OptFindOne = Parameters<typeof findTagById>
export async function findOne(
	...option: OptFindOne
): Promise<ApiResultOptional<Tag, FindTagByIdError>> {
	return apiResultFromOptional(await findTagById(...option))
}

type OptFindMany = Parameters<typeof findTagByKeyword>
export async function findMany(
	...option: OptFindMany
): Promise<ApiResult<Tag[], FindTagByKeywordError>> {
	return apiResultFrom(await findTagByKeyword(...option))
}

type OptCreate = Parameters<typeof createTag>
export async function create(
	...option: OptCreate
): Promise<ApiResult<Message, CreateTagError>> {
	const res = await createTag(...option)
	if (res.data !== undefined) return E.right(res.data)
	if (res.error) return E.left({ type: "Server", error: res.error })
	return E.left({ type: "Response", error: "Unknown Error" })
}

type OptUpsert = Parameters<typeof upsertTagCorrection>
export async function upsertCorrection(
	...option: OptUpsert
): Promise<ApiResult<Message, UpsertTagCorrectionError>> {
	const res = await upsertTagCorrection(...option)
	if (res.data !== undefined) return E.right(res.data)
	if (res.error) return E.left({ type: "Server", error: res.error })
	return E.left({ type: "Response", error: "Unknown Error" })
}
