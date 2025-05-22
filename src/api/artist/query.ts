import { queryOptions } from "@tanstack/solid-query"
import { notFound } from "@tanstack/solid-router"

import * as F from "./fetcher"

export function findByIdOption(id: number) {
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
