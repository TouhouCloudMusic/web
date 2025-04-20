import { CreateQueryResult } from "@tanstack/solid-query"

import { Result } from "../adt"

export const enum FutureState {
	Ready,
	Pending,
}

export interface Pending extends Future<unknown> {
	state: FutureState.Pending
	output: undefined
}

export interface Ready<T> extends Future<T> {
	state: FutureState.Ready
	output: T
}

export class Future<T> {
	private constructor(
		public state: FutureState,
		public output?: T,
	) {}
	static Pending<T = unknown>(): Future<T> {
		return new Future(FutureState.Pending)
	}

	static Ready<T>(value: T): Future<T> {
		return new Future(FutureState.Ready, value)
	}

	isReady(): this is Ready<T> {
		return this.state === FutureState.Ready
	}

	isPending(): this is Pending {
		return this.state === FutureState.Pending
	}
}

export class FutureResult {
	static Pending<T = unknown>(): Future<Result<T, unknown>> {
		return Future.Pending<Result<T, unknown>>()
	}
	static fromPromise<T>(promise: Promise<T>): Future<Result<T, unknown>> {
		const inst = Future.Pending<Result<T, unknown>>()
		promise
			.then((v) => {
				inst.state = FutureState.Ready
				inst.output = Result.Ok(v)
			})
			.catch((e) => {
				inst.state = FutureState.Ready
				inst.output = Result.Err(e)
			})

		return inst
	}

	static fromQueryResult<T, E>(
		queryResult: CreateQueryResult<T, E>,
	): Future<Result<T, E>> {
		if (queryResult.isError) {
			return Future.Ready(Result.Err(queryResult.error))
		} else if (queryResult.isSuccess) {
			return Future.Ready(Result.Ok(queryResult.data))
		} else {
			return Future.Pending()
		}
	}
}
