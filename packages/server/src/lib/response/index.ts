import { error, StatusMap } from "elysia"
import { ElysiaCustomStatusResponse } from "elysia/error"

type Ok<T> = {
  readonly state: "success"
  readonly data: T
}

type Error<
  Code extends number | keyof StatusMap,
  E,
> = ElysiaCustomStatusResponse<
  Code,
  {
    readonly state: "error"
    readonly message: E
  }
>

function notFound(): Error<404, "404 Not Found">
function notFound<const E extends string>(message: E): Error<404, E>
function notFound<E>(message?: E) {
  return error(404, {
    state: "error",
    message: message ?? "404 Not Found",
  })
}
function internalServerError(): Error<500, "Internal Server Error">
function internalServerError<const E extends string>(message: E): Error<500, E>
function internalServerError<E>(message?: E) {
  return error(500, {
    state: "error",
    message: message ?? "Internal Server Error",
  })
}

export const Response = {
  ok<const T>(data: T): Ok<T> {
    return {
      state: "success",
      data,
    }
  },
  err<Code extends number | keyof StatusMap, const E>(
    code: Code,
    messaage: E,
  ): Error<Code, E> {
    return error(code, { state: "error", message: messaage })
  },
  notFound,
  internalServerError,
  hello<T extends string>(name: T): Ok<`Hello, ${T}`> {
    return Response.ok(`Hello, ${name}`)
  },
}
