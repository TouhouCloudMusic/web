import { type CreateQueryResult } from "@tanstack/solid-query"
import createFetchClient from "openapi-fetch"
import { Accessor, createEffect, createMemo, on } from "solid-js"
import { createMutable } from "solid-js/store"

import type { paths } from "./openapi"

export const FetchClient = createFetchClient<paths>({
	baseUrl: "/api",
})

// export type Data<T> = Ok<T> | Err | Pending

const enum ResourceState {
	Ok,
	Loading,
	Err,
}

export interface Ok<T> extends Resource<T, unknown> {
	readonly value: T
	readonly state: ResourceState.Ok
}

export interface Loading extends Resource<unknown, unknown> {
	readonly value: undefined
	readonly state: ResourceState.Loading
}

export interface Err<E> extends Resource<unknown, E> {
	readonly value: undefined
	readonly state: ResourceState.Err
	readonly error: E
}

export class Resource<T, E = unknown> {
	private constructor(
		private $state: ResourceState,
		private $value?: T,
		private $error?: E,
	) {}
	static Ok<T, E = unknown>(value: T): Resource<T, E> {
		return new Resource<T, E>(ResourceState.Ok, value)
	}

	static Loading<T = unknown, E = unknown>(): Resource<T, E> {
		return new Resource(ResourceState.Loading)
	}

	static Err<T, E>(error: E): Resource<T, E> {
		return new Resource(ResourceState.Err, undefined as T, error)
	}
	static fromPromise<T>(promise: Promise<T>): Resource<T, unknown> {
		const inst = new Resource<T, unknown>(ResourceState.Loading)
		promise
			.then((v) => {
				inst.$state = ResourceState.Ok
				inst.$value = v
			})
			.catch((e) => {
				inst.$state = ResourceState.Err
				inst.$error = e
			})

		return inst
	}
	static fromQueryResult<T, E>(
		queryResult: CreateQueryResult<T, E>,
	): Resource<T, E> {
		if (queryResult.isError) {
			return Resource.Err(queryResult.error)
		} else if (queryResult.isSuccess) {
			return Resource.Ok(queryResult.data)
		} else {
			return Resource.Loading()
		}
	}
	get value(): T | undefined {
		return this.$value
	}
	get state(): ResourceState {
		return this.$state
	}
	isOk(): this is Ok<T> {
		return this.$state === ResourceState.Ok
	}

	isPending(): this is Loading {
		return this.$state === ResourceState.Loading
	}
	isErr(): this is Err<E> {
		return this.$state === ResourceState.Err
	}
	unwrap(): T {
		if (import.meta.env.DEV) {
			if (this.isOk()) return this.value as T
			else
				throw new Error(
					`Unwrap a Ok on ${this.$state != ResourceState.Loading ? "an" : "a"} ${DataState_toString(this.$state)} value`,
				)
		} else return this.$value as T
	}
	unwrapErr(): E {
		if (import.meta.env.DEV) {
			if (this.isErr()) return this.$error as E
			else
				throw new Error(
					`Unwrap an Err on ${this.$state != ResourceState.Loading ? "an" : "a"} ${DataState_toString(this.$state)} value`,
				)
		} else return this.$error as E
	}
}

function DataState_toString(state: ResourceState) {
	switch (state) {
		case ResourceState.Ok:
			return "Ok"
		case ResourceState.Loading:
			return "Pending"
		// case ResourceTag.Err:
		// 	return "Err"
	}
}
