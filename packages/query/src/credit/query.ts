import { queryOptions } from "@tanstack/solid-query"
import { CreditApi } from "@thc/api"

export function findByKeyword(keyword: string) {
	return queryOptions({
		queryKey: ["credit-role::summary", keyword],
		queryFn: async () => {
			const result = await CreditApi.findManyCreditRolesSummary({
				query: { keyword },
			})

			if (result.status === "Ok") {
				return result.data
			}
			return []
		},
		throwOnError: true,
	})
}
