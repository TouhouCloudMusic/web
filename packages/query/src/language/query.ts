import { queryOptions } from "@tanstack/solid-query"
import type { Language } from "@thc/api"
import { LanguageApi } from "@thc/api"
import { Either } from "effect"

const LANGUAGES_STALE_TIME = 86_400_000 // 1 day (86,400,000 milliseconds)

export function findAll() {
	return queryOptions({
		queryKey: ["languages::all"],
		queryFn: () => LanguageApi.findAll(),
		staleTime: LANGUAGES_STALE_TIME,
		gcTime: LANGUAGES_STALE_TIME,
		throwOnError: true,
	})
}
