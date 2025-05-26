import { queryOptions } from "@tanstack/solid-query"
import { notFound } from "@tanstack/solid-router"

import type { ReleaseType } from "../release"
import type { Pagination } from "../shared"
import * as F from "./fetcher"

export function findById(id: number) {
	return queryOptions({
		queryKey: ["artist::profile", id],
		queryFn: async () => {
			const artist = await F.__findById(id)
			if (!artist) {
				throw notFound()
			}
			return artist
		},
		throwOnError: true,
	})
}

export function discographies(
	id: number,
	releaseType: ReleaseType,
	pagination?: Pagination,
) {
	return queryOptions({
		queryKey: ["artist::discographies", id, releaseType, pagination],
		queryFn: async () => {
			const discographies = await F.__discographies(id, releaseType, pagination)
			return discographies
		},
		throwOnError: true,
	})
}
