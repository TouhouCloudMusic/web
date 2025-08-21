import { either as E, option as O } from "fp-ts"

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

type ClientResponse<T, E> = (
	| {
			data: OkResponse<T>
			error?: undefined
	  }
	| {
			data: undefined
			error?: E
	  }
) &
	RawResponse

type ClientMessageResponse<E> = (
	| {
			data: MessageResponse
			error?: undefined
	  }
	| {
			data: undefined
			error?: E
	  }
) &
	RawResponse

export type ApiError<E> =
	| {
			type: "Server"
			error: E
	  }
	| {
			type: "Response"
			error: string
	  }

export type ApiResult<T, E = ErrResponse> = E.Either<ApiError<E>, T>
export type ApiResultOptional<T, E = ErrResponse> = E.Either<
	ApiError<E>,
	O.Option<NonNullable<T>>
>

type RestError<E> = {
	error?: E
} & RawResponse

function handleError<T, E>(res: RestError<E>): ApiResult<T, E> {
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

export function apiResultFrom<T = string, E = never>(
	res: ClientResponse<T, E>,
): ApiResult<T, E> {
	if (res.data !== undefined) {
		return E.right(res.data.data)
	}

	return handleError(res)
}

export function apiResultFromOptional<T, E>(
	res: ClientResponse<T, E>,
): ApiResult<O.Option<NonNullable<T>>, E> {
	if (res.data !== undefined) {
		return E.right(O.fromNullable(res.data.data))
	}

	return handleError(res)
}

export function apiResultFromMessage<E>(
	res: ClientMessageResponse<E>,
): ApiResult<string, E> {
	if (res.data !== undefined) {
		return E.right(res.data.message)
	}

	return handleError(res)
}
