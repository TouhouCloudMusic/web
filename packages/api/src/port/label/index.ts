import { either as E } from "fp-ts"

import type {
	Label,
	Message,
	FindLabelByIdError,
	FindLabelByKeywordError,
	CreateLabelError,
	UpsertLabelCorrectionError,
} from "~/gen"
import {
	findLabelById,
	findLabelByKeyword,
	createLabel,
	upsertLabelCorrection,
} from "~/gen"
import type { ApiResult, ApiResultOptional } from "~/shared"
import { apiResultFrom, apiResultFromOptional } from "~/shared"

type OptFindOne = Parameters<typeof findLabelById>
export async function findOne(
	...option: OptFindOne
): Promise<ApiResultOptional<Label, FindLabelByIdError>> {
	return apiResultFromOptional(await findLabelById(...option))
}

type OptFindMany = Parameters<typeof findLabelByKeyword>
export async function findMany(
	...option: OptFindMany
): Promise<ApiResult<Label[], FindLabelByKeywordError>> {
	return apiResultFrom(await findLabelByKeyword(...option))
}

type OptCreate = Parameters<typeof createLabel>
export async function create(
	...option: OptCreate
): Promise<ApiResult<Message, CreateLabelError>> {
	const res = await createLabel(...option)
	if (res.data !== undefined) return E.right(res.data)
	if (res.error) return E.left({ type: "Server", error: res.error })
	return E.left({ type: "Response", error: "Unknown Error" })
}

type OptUpsert = Parameters<typeof upsertLabelCorrection>
export async function upsertCorrection(
	...option: OptUpsert
): Promise<ApiResult<Message, UpsertLabelCorrectionError>> {
	const res = await upsertLabelCorrection(...option)
	if (res.data !== undefined) return E.right(res.data)
	if (res.error) return E.left({ type: "Server", error: res.error })
	return E.left({ type: "Response", error: "Unknown Error" })
}
