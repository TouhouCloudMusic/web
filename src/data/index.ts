import { type CreateQueryResult } from "@tanstack/solid-query"
import createFetchClient from "openapi-fetch"

import type { paths } from "./openapi"

export const FetchClient = createFetchClient<paths>({
	baseUrl: "/api",
})

export type Data<T> =
	| Ok<T>
	| {
			state: DataState.Err | DataState.Pending
	  }

const enum DataState {
	Ok,
	Err,
	Pending,
}

export type Ok<T> = {
	value: T
	state: DataState.Ok
}

export const Data = {
	isOk(data: Data<unknown>): data is Ok<unknown> {
		return data.state === DataState.Ok
	},
	isErr(data: Data<unknown>): data is { state: DataState.Err } {
		return data.state === DataState.Err
	},
	isPending(data: Data<unknown>): data is { state: DataState.Pending } {
		return data.state === DataState.Pending
	},
	fromQueryResult<T>(queryResult: CreateQueryResult<T>): Data<T> {
		if (queryResult.isError)
			return {
				state: DataState.Err,
			}
		else if (queryResult.isLoading)
			return {
				state: DataState.Pending,
			}
		else
			return {
				value: queryResult.data,
				state: DataState.Ok,
			} as Ok<T>
	},
}
