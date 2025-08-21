import type { components, operations } from "~/gen"
import { FetchClient } from "~/http"
import type { ApiResult, ApiResultOptional } from "~/shared"
import { adaptApiResult, adaptApiResultOptional } from "~/shared"

export async function findCreditRoleById(options: {
	path: operations["find_credit_role_by_id"]["parameters"]["path"]
}): Promise<ApiResultOptional<components["schemas"]["CreditRole"], unknown>> {
	const res = await FetchClient.GET("/credit-role/{id}", {
		params: { path: options.path },
	})

	return adaptApiResultOptional(res)
}

export async function findManyCreditRolesSummary(options: {
	query: operations["find_many_credit_roles_summary"]["parameters"]["query"]
}): Promise<ApiResult<components["schemas"]["CreditRoleSummary"][], unknown>> {
	const res = await FetchClient.GET("/credit-role/summary", {
		params: { query: options.query },
	})

	return adaptApiResult(res)
}
