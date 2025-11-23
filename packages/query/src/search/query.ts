import { queryOptions } from "@tanstack/solid-query"
import type { SearchType } from "@thc/api"
import { SearchApi } from "@thc/api"
import { Either, identity } from "effect"

export function search(keyword: string, type?: SearchType | null) {
	return queryOptions({
		queryKey: ["search", keyword, type],
		queryFn: async () => {
			const result = await SearchApi.search({
				query: { keyword, type: type ?? undefined },
			})
			return Either.match(result, {
				onRight: identity,
				onLeft: (error) => {
					throw error
				},
			})
		},
		throwOnError: true,
		enabled: keyword.trim().length > 0,
	})
}
