import { queryOptions } from "@tanstack/solid-query"
import { CreditApi } from "@thc/api"

export function findByKeyword(keyword: string) {
	return queryOptions({
		queryKey: ["credit-role::summary", keyword],
		queryFn: () =>
			CreditApi.findManyCreditRolesSummary({
				query: { keyword },
			}),
		throwOnError: true,
	})
}
