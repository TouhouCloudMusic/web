import type { components } from "~/gen"
import { FetchClient } from "~/http"
import type { ApiResult } from "~/shared"
import { adaptApiResult } from "~/shared"

export async function findAll(): Promise<
	ApiResult<components["schemas"]["Language"][], unknown>
> {
	const res = await FetchClient.GET("/languages", {})

	return adaptApiResult(res)
}
