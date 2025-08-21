import { either as E } from "fp-ts"

import type { Message, HealthCheckError } from "~/gen"
import { healthCheck } from "~/gen"
import type { ApiResult } from "~/shared"

export async function ping(
	...option: Parameters<typeof healthCheck>
): Promise<ApiResult<Message, HealthCheckError>> {
	const res = await healthCheck(...option)
	if (res.data !== undefined) return E.right(res.data)
	return E.left({ type: "Response", error: "Unknown Error" })
}

