import { either as E } from "fp-ts"

import type {
	Artist,
	InitDiscography,
	Message,
	PaginatedCredit,
	PaginatedDiscography,
	CreateArtistError,
	FindArtistApperancesError,
	FindArtistByIdError,
	FindArtistDiscographiesByTypeError,
	FindArtistDiscographiesInitError,
	FindManyArtistError,
	GetArtistCreditsError,
	UploadArtistProfileImageError,
	UpsertArtistCorrectionError,
} from "~/gen"
import {
	createArtist,
	findArtistApperances,
	findArtistById,
	findArtistDiscographiesByType,
	findArtistDiscographiesInit,
	findManyArtist,
	getArtistCredits,
	uploadArtistProfileImage,
	upsertArtistCorrection,
} from "~/gen"
import type { ApiResult, ApiResultOptional } from "~/shared"
import { apiResultFrom, apiResultFromOptional } from "~/shared"

type OptFindOne = Parameters<typeof findArtistById>
export async function findOne(
	...option: OptFindOne
): Promise<ApiResultOptional<Artist, FindArtistByIdError>> {
	return apiResultFromOptional(await findArtistById(...option))
}

type OptFindMany = Parameters<typeof findManyArtist>
export async function findMany(
	...option: OptFindMany
): Promise<ApiResult<Artist[], FindManyArtistError>> {
	return apiResultFrom(await findManyArtist(...option))
}

type OptCreate = Parameters<typeof createArtist>
export async function create(
	...option: OptCreate
): Promise<ApiResult<Message, CreateArtistError>> {
	const res = await createArtist(...option)
	if (res.data !== undefined) return E.right(res.data)
	if (res.error) return E.left({ type: "Server", error: res.error })
	return E.left({ type: "Response", error: res.response.statusText })
}

type OptUpsert = Parameters<typeof upsertArtistCorrection>
export async function upsertCorrection(
	...option: OptUpsert
): Promise<ApiResult<Message, UpsertArtistCorrectionError>> {
	const res = await upsertArtistCorrection(...option)
	if (res.data !== undefined) return E.right(res.data)
	if (res.error) return E.left({ type: "Server", error: res.error })
	return E.left({ type: "Response", error: res.response.statusText })
}

type OptAppear = Parameters<typeof findArtistApperances>
export async function appearances(
	...option: OptAppear
): Promise<ApiResult<PaginatedDiscography, FindArtistApperancesError>> {
	return apiResultFrom(await findArtistApperances(...option))
}

type OptCredits = Parameters<typeof getArtistCredits>
export async function credits(
	...option: OptCredits
): Promise<ApiResult<PaginatedCredit, GetArtistCreditsError>> {
	return apiResultFrom(await getArtistCredits(...option))
}

type OptDiscByType = Parameters<typeof findArtistDiscographiesByType>
export async function discographiesByType(
	...option: OptDiscByType
): Promise<
	ApiResult<PaginatedDiscography, FindArtistDiscographiesByTypeError>
> {
	return apiResultFrom(await findArtistDiscographiesByType(...option))
}

type OptDiscInit = Parameters<typeof findArtistDiscographiesInit>
export async function discographiesInit(
	...option: OptDiscInit
): Promise<ApiResult<InitDiscography, FindArtistDiscographiesInitError>> {
	return apiResultFrom(await findArtistDiscographiesInit(...option))
}

type OptUploadProfile = Parameters<typeof uploadArtistProfileImage>
export async function uploadProfileImage(
	...option: OptUploadProfile
): Promise<ApiResult<Message, UploadArtistProfileImageError>> {
	const res = await uploadArtistProfileImage(...option)
	if (res.data !== undefined) return E.right(res.data)
	if (res.error) return E.left({ type: "Server", error: res.error })
	return E.left({ type: "Response", error: "Unknown Error" })
}
