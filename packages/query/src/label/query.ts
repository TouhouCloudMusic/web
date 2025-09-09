import { queryOptions } from "@tanstack/solid-query"
import type { Label } from "@thc/api"
import { LabelApi } from "@thc/api"
import { Either, identity } from "effect"

// 标签查询：按ID
export function findById(id: number) {
	return queryOptions({
		queryKey: ["label::profile", id],
		queryFn: async () => {
			const result = await LabelApi.findLabelById({ path: { id } })
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

// 标签查询：按关键字
export function findByKeyword(keyword: string) {
	return queryOptions({
		queryKey: ["label::keyword", keyword],
		queryFn: async () => {
			const result = await LabelApi.findLabelByKeyword({
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
