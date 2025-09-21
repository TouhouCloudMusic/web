import { queryOptions } from "@tanstack/solid-query"
import { TagApi } from "@thc/api"
import { Either, identity } from "effect"

export function findById(id: number) {
	return queryOptions({
		queryKey: ["tag::detail", id],
		queryFn: async () => {
			const result = await TagApi.findTagById({
				path: { id },
			})
			return Either.match(result, {
				onRight: identity,
				onLeft: (error) => {
					throw error
				},
			})
		},
		throwOnError: true,
	})
}

export function findByKeyword(keyword: string) {
	return queryOptions({
		queryKey: ["tag::search", keyword],
		queryFn: async () => {
			const result = await TagApi.findTagByKeyword({
				query: { keyword },
			})
			return Either.match(result, {
				onRight: (data) => data,
				onLeft: (error) => {
					throw error
				},
			})
		},
		throwOnError: true,
	})
}
