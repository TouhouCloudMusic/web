import { FetchClient } from ".."
import { handleApiResponse } from "../utils"

export async function findById(id: number) {
	let res = await FetchClient.GET("/release/{id}", {
		params: {
			path: { id: id },
		},
	})

	return handleApiResponse(res)
}

export async function findByKeyword(keyword: string) {
	let res = await FetchClient.GET("/release", {
		params: {
			query: { keyword },
		},
	})

	return handleApiResponse(res)
} 