/* eslint-disable @typescript-eslint/no-unused-vars */
import { Option, some, none } from "fp-ts/Option"
import { NonUndefined } from "./base"

// const OkSymbol = Symbol("Ok")
// const ErrSymbol = Symbol("Err")

interface Match<T, E, U> {
	ok: (v: T) => U
	err: (v: E) => U
}

export interface Result<T extends NonUndefined, E extends NonUndefined> {
	// symbol: typeof OkSymbol | typeof ErrSymbol
	ok(): Option<T>
	err(): Option<E>
	unwarp(): T | never
	unwrap_err(): E | never
	unwrap_or(fallback: T): T
	unwrap_or_else(fallback: () => T): T
	match<U extends NonUndefined>(f: Match<T, E, U>): U
	map<U extends NonUndefined>(f: (a: T) => U): Result<U, E>
	map_err<F extends NonUndefined>(f: (a: E) => F): Result<T, F>
	and_then<U extends NonUndefined>(f: (a: T) => Result<U, E>): Result<U, E>
	or_else<F extends NonUndefined>(f: (a: E) => Result<T, F>): Result<T, F>
}

interface OkResult<T extends NonUndefined, E extends NonUndefined>
	extends Result<T, E> {
	// symbol: typeof OkSymbol
	unwarp(): T
	unwrap_err(): never
}

interface ErrResult<T extends NonUndefined, E extends NonUndefined>
	extends Result<T, E> {
	// symbol: typeof ErrSymbol
	unwarp(): never
	unwrap_err(): E
}

export class Ok<T extends NonUndefined, E extends NonUndefined>
	implements OkResult<T, E>
{
	constructor(private readonly value: T) {}

	// readonly symbol: typeof OkSymbol = OkSymbol

	ok(): Option<T> {
		return some(this.value)
	}

	err(): Option<E> {
		return none
	}

	unwarp() {
		return this.value
	}

	unwrap_err(): never {
		throw new ReferenceError("Unable to unwrap Err value from OK result")
	}

	unwrap_or(fallback: T) {
		return this.value
	}

	unwrap_or_else(fallback: () => T) {
		return this.value
	}

	match<U extends NonUndefined>(m: Match<T, E, U>): U {
		return m.ok(this.value)
	}

	map<U extends NonUndefined>(fn: (a: T) => U): Result<U, E> {
		return new Ok(fn(this.value))
	}

	map_err<F extends NonUndefined>(fn: (a: E) => F): Result<T, F> {
		return new Ok(this.value)
	}

	and_then<U extends NonUndefined>(fn: (a: T) => Result<U, E>): Result<U, E> {
		return fn(this.value)
	}

	or_else<F extends NonUndefined>(fn: (a: E) => Result<T, F>): Result<T, F> {
		return new Ok(this.value)
	}
}

export class Err<T extends NonUndefined, E extends NonUndefined>
	implements ErrResult<T, E>
{
	constructor(private readonly value: E) {}

	// readonly symbol: typeof ErrSymbol = ErrSymbol

	ok(): Option<T> {
		return none
	}

	err(): Option<E> {
		return some(this.value)
	}

	unwarp(): never {
		throw new ReferenceError("Unable to unwrap Ok value from Err result")
	}

	unwrap_err() {
		return this.value
	}

	unwrap_or(fallback: T): T {
		return fallback
	}

	unwrap_or_else(fallback: () => T): T {
		return fallback()
	}

	match<U extends NonUndefined>(m: Match<T, E, U>): U {
		return m.err(this.value)
	}

	map<U extends NonUndefined>(fn: (a: T) => U): Result<U, E> {
		return new Err(this.value)
	}

	map_err<F extends NonUndefined>(fn: (a: E) => F): Result<T, F> {
		return new Err(fn(this.value))
	}

	and_then<U extends NonUndefined>(fn: (a: T) => Result<U, E>): Result<U, E> {
		return new Err(this.value)
	}

	or_else<F extends NonUndefined>(fn: (a: E) => Result<T, F>): Result<T, F> {
		return fn(this.value)
	}
}
