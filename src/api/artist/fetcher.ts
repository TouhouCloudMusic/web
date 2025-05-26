import { FetchClient } from ".."
import type { ReleaseType } from "../release"
import type { Pagination } from "../shared"
import { handleApiResponse } from "../utils"
import type { NewArtistCorrectionOut } from "./schema"

export interface __CreataOption {
	data: NewArtistCorrectionOut
}
export async function __create(opt: __CreataOption) {
	const { data, error, response } = await FetchClient.POST("/artist", {
		body: opt.data,
	})
	if (data) {
		return data
	}

	if (error) {
		throw new Error(error.message)
	}

	throw new Error(response.statusText)
}

export async function __findById(id: number) {
	const res = await FetchClient.GET(`/artist/{id}`, {
		params: {
			path: {
				id,
			},
		},
	})

	return handleApiResponse(res)
}

export async function __discographies(
	id: number,
	releaseType: ReleaseType,
	pagination?: Pagination,
) {
	const res = await FetchClient.GET(`/artist/{id}/discographies`, {
		params: {
			path: {
				id,
			},
			query: {
				release_type: releaseType,
				pagination: pagination ?? {
					cursor: 0,
					limit: 10,
				},
			},
		},
	})

	return handleApiResponse(res)
}
