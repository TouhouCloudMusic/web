import { pipe } from "@thc/toolkit"
import type { ADTEnum } from "@thc/toolkit/types"
import { Either as E, Option as O } from "effect"

type OkResponse<T> = {
	status: string
	data: T
}

type MessageResponse = {
	status: "Ok"
	message: string
}

type ErrResponse = {
	status: "Err"
	message: string
}

type RawResponse = {
	request: Request
	response: Response
}

export type ApiResponse<T> = OkResponse<T> | MessageResponse | ErrResponse
export type ApiResponseNonExhaustive<T> = ApiResponse<T> & RawResponse

export type ApiError<E> =
	| {
			type: "Server"
			error: E
	  }
	| {
			type: "Response"
			error: string
	  }

export type ApiResult<T, E = ErrResponse> = E.Either<T, ApiError<E>>
export type ApiResultOptional<T, E = ErrResponse> = E.Either<
	O.Option<NonNullable<T>>,
	ApiError<E>
>

type RestError<E> = {
	error?: E
	response: Response
}

function handleError<E>(res: RestError<E>): E.Either<never, ApiError<E>> {
	if (res.error) {
		return E.left({
			type: "Server",
			error: res.error,
		})
	}

	return E.left({
		type: "Response",
		error: res.response.statusText,
	})
}

type FetchResponse<T, E> = ADTEnum<
	[
		{
			data: OkResponse<T>
		},
		{
			error: E
		},
	]
> & {
	response: Response
}

export function adaptApiResult<T, E>(
	res: FetchResponse<T, E>,
): ApiResult<T, E> {
	if (res.data) {
		return E.right(res.data.data)
	}

	return handleError(res)
}

export function adaptApiResultOptional<T, E = unknown>(
	res: FetchResponse<T, E>,
): ApiResult<O.Option<NonNullable<T>>, E> {
	if (res.data) {
		return E.right(O.fromNullable(res.data.data))
	}

	return handleError(res)
}

type FetchMessageResponse<E> = ADTEnum<
	[
		{
			data: {
				message: string
			}
		},
		{
			error: E
		},
	]
> & {
	response: Response
}

export function adaptApiResultMessage<E>(
	res: FetchMessageResponse<E>,
): ApiResult<string, E> {
	return pipe(
		E.fromNullable(res.data, () => res),
		E.map((d) => d.message),
		E.orElse((e) => handleError(e)),
	)
}
