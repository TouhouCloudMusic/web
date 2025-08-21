import type { components, operations } from "~/gen"
import { FetchClient } from "~/http"
import type { ApiResult, ApiResultOptional } from "~/shared"
import {
	adaptApiResult,
	adaptApiResultOptional,
	adaptApiResultMessage,
} from "~/shared"

export async function findOne(options: {
	path: operations["find_artist_by_id"]["parameters"]["path"]
	query?: operations["find_artist_by_id"]["parameters"]["query"]
}): Promise<ApiResultOptional<components["schemas"]["Artist"], unknown>> {
	const res = await FetchClient.GET("/artist/{id}", {
		params: { path: options.path, query: options.query },
	})

	return adaptApiResultOptional(res)
}

export async function findMany(options: {
	query: operations["find_many_artist"]["parameters"]["query"]
}): Promise<ApiResult<components["schemas"]["Artist"][], unknown>> {
	const res = await FetchClient.GET("/artist", {
		params: { query: options.query },
	})

	return adaptApiResult(res)
}

export async function create(options: {
	body: operations["create_artist"]["requestBody"]["content"]["application/json"]
}): Promise<ApiResult<string, unknown>> {
	const res = await FetchClient.POST("/artist", {
		body: options.body,
	})

	return adaptApiResultMessage(res)
}

export async function upsertCorrection(options: {
	path: operations["upsert_artist_correction"]["parameters"]["path"]
	body: operations["upsert_artist_correction"]["requestBody"]["content"]["application/json"]
}): Promise<ApiResult<string, unknown>> {
	const res = await FetchClient.POST("/artist/{id}", {
		params: { path: options.path },
		body: options.body,
	})

	return adaptApiResultMessage(res)
}

export async function findAppearances(options: {
	path: operations["find_artist_apperances"]["parameters"]["path"]
	query: operations["find_artist_apperances"]["parameters"]["query"]
}): Promise<
	ApiResult<components["schemas"]["Paginated_Discography"], unknown>
> {
	const res = await FetchClient.GET("/artist/{id}/appearances", {
		params: { path: options.path, query: options.query },
	})

	return adaptApiResult(res)
}

export async function getCredits(options: {
	path: operations["get_artist_credits"]["parameters"]["path"]
	query: operations["get_artist_credits"]["parameters"]["query"]
}): Promise<ApiResult<components["schemas"]["Paginated_Credit"], unknown>> {
	const res = await FetchClient.GET("/artist/{id}/credits", {
		params: { path: options.path, query: options.query },
	})

	return adaptApiResult(res)
}

export async function findDiscographiesByType(options: {
	path: operations["find_artist_discographies_by_type"]["parameters"]["path"]
	query: operations["find_artist_discographies_by_type"]["parameters"]["query"]
}): Promise<
	ApiResult<components["schemas"]["Paginated_Discography"], unknown>
> {
	const res = await FetchClient.GET("/artist/{id}/discographies", {
		params: { path: options.path, query: options.query },
	})

	return adaptApiResult(res)
}

export async function findDiscographiesInit(options: {
	path: operations["find_artist_discographies_init"]["parameters"]["path"]
	query: operations["find_artist_discographies_init"]["parameters"]["query"]
}): Promise<ApiResult<components["schemas"]["InitDiscography"], unknown>> {
	const res = await FetchClient.GET("/artist/{id}/discographies/init", {
		params: { path: options.path, query: options.query },
	})

	return adaptApiResult(res)
}
