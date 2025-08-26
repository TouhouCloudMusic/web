import { queryOptions } from "@tanstack/solid-query"
import { notFound } from "@tanstack/solid-router"
import { SongApi } from "@thc/api"
import { Either } from "effect"

export function findById(id: number) {
	return queryOptions({
		queryKey: ["song::info", id],
		queryFn: () =>
			SongApi.findSongById({
				path: { id },
			}),
		throwOnError: true,
	})
}

export function findByKeyword(keyword: string) {
	return queryOptions({
		queryKey: ["song::info", keyword],
		queryFn: () =>
			SongApi.findSongByKeyword({
				query: { keyword },
			}),
		throwOnError: true,
	})
}
