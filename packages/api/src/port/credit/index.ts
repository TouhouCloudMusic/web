import type {
	CreditRole,
	CreditRoleSummary,
	FindCreditRoleByIdError,
	FindManyCreditRolesSummaryError,
} from "~/gen"
import { findCreditRoleById, findManyCreditRolesSummary } from "~/gen"
import type { ApiResult, ApiResultOptional } from "~/shared"
import { apiResultFrom, apiResultFromOptional } from "~/shared"

type OptFindById = Parameters<typeof findCreditRoleById>
type OptFindSummary = Parameters<typeof findManyCreditRolesSummary>

export async function findOne(
	...option: OptFindById
): Promise<ApiResultOptional<CreditRole, FindCreditRoleByIdError>> {
	return apiResultFromOptional(await findCreditRoleById(...option))
}

export async function summary(
	...option: OptFindSummary
): Promise<ApiResult<CreditRoleSummary[], FindManyCreditRolesSummaryError>> {
	return apiResultFrom(await findManyCreditRolesSummary(...option))
}
