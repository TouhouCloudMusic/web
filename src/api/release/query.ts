import { queryOptions } from "@tanstack/solid-query"
import { notFound } from "@tanstack/solid-router"

import * as F from "./fetcher"

export function findById(id: number) {
	return queryOptions({
		queryKey: ["release::info", id],
		queryFn: async () => {
			const release = await F.findById(id)

			if (!release) {
				throw notFound()
			}

			return release
		},
		throwOnError: true,
	})
}

export function findByKeyword(keyword: string) {
	return queryOptions({
		queryKey: ["release::info", keyword],
		queryFn: async () => {
			const releases = await F.findByKeyword(keyword)

			return releases
		},
		throwOnError: true,
	})
} 