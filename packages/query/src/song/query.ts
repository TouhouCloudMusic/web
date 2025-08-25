import { queryOptions } from "@tanstack/solid-query"
import { notFound } from "@tanstack/solid-router"
import { SongApi } from "@thc/api"

export function findById(id: number) {
	return queryOptions({
		queryKey: ["song::info", id],
		queryFn: async () => {
			const result = await SongApi.findSongById({
				path: { id },
			})

			if (result.status === "Ok" && result.data) {
				return result.data
			}
			throw notFound()
		},
		throwOnError: true,
	})
}

export function findByKeyword(keyword: string) {
	return queryOptions({
		queryKey: ["song::info", keyword],
		queryFn: async () => {
			const result = await SongApi.findSongByKeyword({
				query: { keyword },
			})

			if (result.status === "Ok") {
				return result.data
			}
			return []
		},
		throwOnError: true,
	})
}
