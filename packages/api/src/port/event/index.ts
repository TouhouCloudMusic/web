import { either as E } from "fp-ts"

import type {
	Event,
	Message,
	FindEventByIdError,
	FindEventByKeywordError,
	CreateError,
	UpsertCorrectionError,
} from "~/gen"
import {
	findEventById,
	findEventByKeyword,
	create,
	upsertCorrection,
} from "~/gen"
import type { ApiResult, ApiResultOptional } from "~/shared"
import { apiResultFrom, apiResultFromOptional } from "~/shared"

type OptFindOne = Parameters<typeof findEventById>
export async function findOne(
	...option: OptFindOne
): Promise<ApiResultOptional<Event, FindEventByIdError>> {
	return apiResultFromOptional(await findEventById(...option))
}

type OptFindMany = Parameters<typeof findEventByKeyword>
export async function findMany(
	...option: OptFindMany
): Promise<ApiResult<Event[], FindEventByKeywordError>> {
	return apiResultFrom(await findEventByKeyword(...option))
}

type OptCreate = Parameters<typeof create>
export async function createOne(
	...option: OptCreate
): Promise<ApiResult<Message, CreateError>> {
	const res = await create(...option)
	if (res.data !== undefined) return E.right(res.data)
	if (res.error) return E.left({ type: "Server", error: res.error })
	return E.left({ type: "Response", error: "Unknown Error" })
}

type OptUpsert = Parameters<typeof upsertCorrection>
export async function upsertOneCorrection(
	...option: OptUpsert
): Promise<ApiResult<Message, UpsertCorrectionError>> {
	const res = await upsertCorrection(...option)
	if (res.data !== undefined) return E.right(res.data)
	if (res.error) return E.left({ type: "Server", error: res.error })
	return E.left({ type: "Response", error: "Unknown Error" })
}
