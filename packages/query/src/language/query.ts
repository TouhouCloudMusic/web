import { queryOptions } from "@tanstack/solid-query"
import type { Language } from "@thc/api"
import { LanguageApi } from "@thc/api"

const LANGUAGES_STALE_TIME = 86_400_000 // 1 day (86,400,000 milliseconds)

export function findAll() {
	return queryOptions({
		queryKey: ["languages::all"],
		queryFn: async (): Promise<Language[]> => {
			const result = await LanguageApi.findAll()

			if (result.status === "Ok") {
				return result.data
			}
			return []
		},
		staleTime: LANGUAGES_STALE_TIME,
		gcTime: LANGUAGES_STALE_TIME,
		throwOnError: true,
	})
}
