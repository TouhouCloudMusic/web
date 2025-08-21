import type { components, operations } from "~/gen"
import { FetchClient } from "~/http"
import type { ApiResult } from "~/shared"
import { adaptApiResult, adaptApiResultMessage } from "~/shared"

export async function signin(options: {
	body: operations["sign_in"]["requestBody"]["content"]["application/json"]
}): Promise<ApiResult<components["schemas"]["UserProfile"], unknown>> {
	const res = await FetchClient.POST("/sign-in", {
		body: options.body,
	})

	return adaptApiResult(res)
}

export async function signup(options: {
	body: operations["sign_up"]["requestBody"]["content"]["application/json"]
}): Promise<ApiResult<components["schemas"]["UserProfile"], unknown>> {
	const res = await FetchClient.POST("/sign-up", {
		body: options.body,
	})

	return adaptApiResult(res)
}

export async function signout(): Promise<ApiResult<string, unknown>> {
	const res = await FetchClient.GET("/sign-out", {})

	return adaptApiResultMessage(res)
}
