/* eslint-disable @typescript-eslint/no-unused-vars */
import { NonUndefined } from "./base"
import { default_constructor } from "./default"
import { Err, Ok, Result } from "./result"

const unwrapMsg = "Unable to unwrap value from None option"
// const unwrapErrMsg = "Unable to unwrap none from Some option"

interface Match<A, B> {
	some: (v: A) => B
	none: (() => B) | B
}

// const someSymbol = Symbol("some")
// const noneSymbol = Symbol("none")

// class Option<T extends NonUndefined> {
// 	private _symbol: typeof someSymbol | typeof noneSymbol
// 	private default_val: ReturnType<typeof default_constructor>
// 	constructor(private val?: T) {
// 		if (val) {
// 			this._symbol = someSymbol
// 			this.default_val = default_constructor(val)
// 		} else {
// 			this._symbol = noneSymbol
// 			this.default_val = undefined
// 		}
// 	}

// 	is_some() {
// 		return this._symbol === someSymbol
// 	}
// 	is_none(): this is None<T>{
// 		return this._symbol === noneSymbol
// 	}
// 	expect(msg: string) {
// 		if (this.val) return this.val
// 		throw new Error(msg)
// 	}
// 	unwrap() {
// 		if (this.val) return this.val
// 		throw new Error(unwrapMsg)
// 	}
// 	unwrap_or(optb: T) {
// 		if (this.val) return this.val
// 		return optb
// 	}
// 	unwrap_or_else(f: () => T) {
// 		if (this.val) return this.val
// 		return f()
// 	}
// 	// unwrap_or_default() {
// 	// 	if (this.val) return this.val
// 	// 	return this.default_val
// 	// }
// 	unwrap_unchecked() {
// 		return this.val
// 	}
// 	// inspect(f: () => void): Option<T>
// 	// map<U extends NonUndefined>(f: (v: T) => U): Option<U>
// 	// map_or<U extends NonUndefined>(optb: U, f: (v: T) => U): U
// 	// map_or_else<U extends NonUndefined>(optb: () => U, f: (v: T) => U): U
// 	// match<U extends NonUndefined>(m: Match<T, U>): U
// 	// ok_or<E extends NonUndefined>(err: E): Result<T, E>
// 	// ok_or_else<E extends NonUndefined>(f: () => E): Result<T, E>
// 	// and<U extends NonUndefined>(optb: Option<U>): Option<U>
// 	// and_then<U extends NonUndefined>(f: (v: T) => Option<U>): Option<U>
// 	// filter(f: (v: T) => boolean): Option<T>
// 	// or(optb: Option<T>): Option<T>
// 	// or_else(optb: () => Option<T>): Option<T>
// 	// xor(optb: Option<T>): Option<T>
// 	// insert(v: T): (arg: T) => T
// 	// get_or_insert(v: T): (...args: [T] | []) => T
// 	// get_or_insert_default(): (...args: [T] | []) => T
// 	// get_or_insert_with(f: () => T): (...args: [T] | []) => T

// 	// replace(v: T): Option<T>
// 	// zip<U extends NonUndefined>(other: Option<U>): Option<[T, U]>
// 	// zip_with<U extends NonUndefined, R = Option<[T, U]>>(
// 	// 	other: Option<U>,
// 	// 	f: (a: T, b: U) => R
// 	// ): Option<[Option<T>, Option<U>]>
// 	// transpose(): Result<Option<T>, NonUndefined>
// 	// flatten(): Option<T>
// }

// interface Option<T extends NonUndefined> {
// 	// readonly default: T | undefined
// 	is_some(): boolean
// 	is_none(): boolean
// 	expect(msg: string): T | never
// 	unwrap(): T | never
// 	unwrap_or(optb: T): T
// 	unwrap_or_else(f: () => T): T
// 	unwrap_unchecked(): T | never
// 	inspect(f: () => void): Option<T>
// 	map<U extends NonUndefined>(f: (v: T) => U): Option<U>
// 	map_or<U extends NonUndefined>(optb: U, f: (v: T) => U): U
// 	map_or_else<U extends NonUndefined>(optb: () => U, f: (v: T) => U): U
// 	match<U extends NonUndefined>(m: Match<T, U>): U
// 	ok_or<E extends NonUndefined>(err: E): Result<T, E>
// 	ok_or_else<E extends NonUndefined>(f: () => E): Result<T, E>
// 	and<U extends NonUndefined>(optb: Option<U>): Option<U>
// 	and_then<U extends NonUndefined>(f: (v: T) => Option<U>): Option<U>
// 	filter(f: (v: T) => boolean): Option<T>
// 	or(optb: Option<T>): Option<T>
// 	or_else(optb: () => Option<T>): Option<T>
// 	xor(optb: Option<T>): Option<T>
// 	insert(v: T): (arg: T) => T
// 	get_or_insert(v: T): (...args: [T] | []) => T
// 	get_or_insert_default(): (...args: [T] | []) => T
// 	get_or_insert_with(f: () => T): (...args: [T] | []) => T
// 	replace(v: T): Option<T>
// 	zip<U extends NonUndefined>(other: Option<U>): Option<[T, U]>
// 	zip_with<U extends NonUndefined, R extends NonUndefined>(
// 		other: Option<U>,
// 		f: (a: T, b: U) => R
// 	): Option<R>
// 	transpose(): Result<Option<T>, NonUndefined>
// 	flatten(): Option<T>
// }
type Option<T extends NonUndefined> = Some<T> | None

class Some<T extends NonUndefined> {
	// readonly default: T
	constructor(private val: T) {
		// this.default = default_constructor(val)
	}
	is_some(): this is Some<T> {
		return true
	}
	is_some_and(f: (v: T) => boolean): boolean {
		return f(this.val) && true
	}
	is_none(): this is None {
		return false
	}
	expect(_msg: string): T {
		return this.val
	}
	unwrap(): T {
		return this.val
	}
	unwrap_or(_opth: T): T {
		return this.val
	}
	unwrap_or_else(_f: () => T): T {
		return this.val
	}
	unwrap_unchecked(): T {
		return this.val
	}
	map<U extends NonUndefined>(f: (v: T) => U): Option<U> {
		return new Some(f(this.val))
	}
	inspect<T extends NonUndefined>(
		this: Option<T>,
		f: (v: T) => void
	): Option<T> {
		const copy = (this as Some<T>).val
		f(copy)
		return new Some((this as Some<T>).val)
	}
	map_or<T extends NonUndefined, U extends NonUndefined>(
		this: Option<T>,
		_optb: U,
		f: (v: T) => U
	): U {
		return f((this as Some<T>).val)
	}
	map_or_else<T extends NonUndefined, U extends NonUndefined>(
		this: Option<T>,
		_optb: () => U,
		f: (v: T) => U
	): U {
		return f((this as Some<T>).val)
	}
	match<T extends NonUndefined, U extends NonUndefined>(
		this: Option<T>,
		{ some }: Match<T, U>
	): U {
		return some((this as Some<T>).val)
	}
	ok_or<T extends NonUndefined, E extends NonUndefined>(
		this: Option<T>,
		_err: E
	): Result<T, E> {
		return new Ok((this as Some<T>).val)
	}
	ok_or_else<T extends NonUndefined, E extends NonUndefined>(
		this: Option<T>,
		_f: () => E
	): Result<T, E> {
		return new Ok((this as Some<T>).val)
	}
	// as_deref(): () => Option<T> {
	// 	throw new Error("Method not implemented.")
	// }
	// iter(): Iterator<T, T, undefined> {
	// 	throw new Error("Method not implemented.")
	// }
	and<U extends NonUndefined>(optb: Option<U>): Option<U> {
		return optb
	}
	and_then<T extends NonUndefined, U extends NonUndefined>(
		this: Option<T>,
		f: (v: T) => Option<U>
	): Option<U> {
		return f((this as Some<T>).val)
	}
	filter<T extends NonUndefined>(
		this: Option<T>,
		f: (v: T) => boolean
	): Option<T> {
		return f((this as Some<T>).val) ?
				new Some((this as Some<T>).val)
			:	new None()
	}
	or<T extends NonUndefined>(this: Option<T>, _optb: Option<T>): Option<T> {
		return new Some((this as Some<T>).val)
	}
	or_else<T extends NonUndefined>(
		this: Option<T>,
		_optb: () => Option<T>
	): Option<T> {
		return new Some((this as Some<T>).val)
	}
	xor<T extends NonUndefined>(this: Option<T>, optb: Option<T>): Option<T> {
		if (optb.is_none()) return new Some((this as Some<T>).val)
		return new None()
	}
	// insert<T extends NonUndefined>(
	// 	this: Option<T>,
	// 	v: T
	// ): (...args: [] | [T]) => T {
	// 	this.val = v
	// 	return this.get_or_insert()
	// }
	// get_or_insert(_v?: T): (...args: [] | [T]) => T {
	// 	return (...args: [T] | []) => {
	// 		if (args.length === 1) {
	// 			this.val = args[0]
	// 		}
	// 		return this.val
	// 	}
	// }
	// get_or_insert_default(): (...args: [] | [T]) => T {
	// 	return this.get_or_insert()
	// }
	// get_or_insert_with(_f: () => T): (...args: [] | [T]) => T {
	// 	return this.get_or_insert()
	// }
	// replace(v: T): Option<T> {
	// 	const old = this.val
	// 	this.val = v
	// 	return new Some(old)
	// }
	// zip<U extends NonUndefined>(other: Option<U>): Option<[T, U]> {
	// 	if (other.is_none()) return new None()
	// 	return new Some([this.val, other.unwrap()] as [T, U])
	// }
	// zip_with<U extends NonUndefined, R extends NonUndefined>(
	// 	other: Option<U>,
	// 	f: (a: T, b: U) => R
	// ): Option<R> {
	// 	if (other.is_none()) return new None() as Option<R>
	// 	return new Some(f(this.val, other.unwrap()))
	// }
	// transpose(): Result<Option<T>, NonUndefined> {
	// 	return new Ok(new Some(this.val))
	// }
	// flatten(): Option<T> {
	// 	if (this.val instanceof Some) return new Some(this.val.unwrap())
	// 	return new None() as Option<T>
	// }
}

class None {
	// readonly default: undefined
	constructor() {
		// this.default = undefined
	}
	is_some<T extends NonUndefined>(this: Option<T>): this is Some<T> {
		return false
	}
	is_some_and(_f: (v: unknown) => boolean) {
		return false
	}
	is_none(): this is None {
		return true
	}
	expect(msg: string): never {
		throw new Error(msg)
	}
	unwrap(): never {
		throw new Error(unwrapMsg)
	}
	unwrap_or<T>(optb: T): T {
		return optb
	}
	unwrap_or_else<T>(f: () => T): T {
		return f()
	}
	unwrap_unchecked(): never {
		throw new Error(unwrapMsg)
	}
	inspect<T extends NonUndefined>(
		this: Option<T>,
		_f: (v: T) => void
	): Option<T> {
		return new None()
	}
	map<T extends NonUndefined, U extends NonUndefined>(
		_f: (v: T) => U
	): Option<U> {
		return new None()
	}
	map_or<T extends NonUndefined, U extends NonUndefined>(
		this: Option<T>,
		optb: U,
		_f: (v: T) => U
	): U {
		return optb
	}
	map_or_else<T extends NonUndefined, U extends NonUndefined>(
		this: Option<T>,
		optb: () => U,
		_f: (v: T) => U
	): U {
		return optb()
	}
	match<T extends NonUndefined, U extends NonUndefined>(
		this: Option<T>,
		{ none }: Match<T, U>
	): U {
		if (typeof none === "function") {
			return none() as U
		}
		return none
	}
	ok_or<T extends NonUndefined, E extends NonUndefined>(
		this: Option<T>,
		err: E
	): Result<T, E> {
		return new Err(err)
	}
	ok_or_else<T extends NonUndefined, E extends NonUndefined>(
		this: Option<T>,
		f: () => E
	): Result<T, E> {
		return new Err(f())
	}
	and<U extends NonUndefined>(_optb: Option<U>): Option<U> {
		return new None()
	}
	and_then<T extends NonUndefined, U extends NonUndefined>(
		this: Option<T>,
		_f: (v: T) => Option<U>
	): Option<U> {
		return new None()
	}
	filter<T extends NonUndefined>(
		this: Option<T>,
		_f: (v: T) => boolean
	): Option<T> {
		return new None()
	}
	or<T extends NonUndefined>(this: Option<T>, optb: Option<T>): Option<T> {
		return optb
	}
	or_else<T extends NonUndefined>(
		this: Option<T>,
		optb: () => Option<T>
	): Option<T> {
		return optb()
	}
	xor<T extends NonUndefined>(this: Option<T>, optb: Option<T>): Option<T> {
		if (optb.is_some()) return optb
		return new None()
	}
	// insert<T extends NonUndefined>(this: Option<T>, v: T): (arg: T) => T {
	// 	throw new Error("Method not implemented.")
	// }
	// get_or_insert(v: T): (...args: [] | [T]) => T {
	// 	throw new Error("Method not implemented.")
	// }
	// get_or_insert_default(): (...args: [] | [T]) => T {
	// 	throw new Error("Method not implemented.")
	// }
	// get_or_insert_with(f: () => T): (...args: [] | [T]) => T {
	// 	throw new Error("Method not implemented.")
	// }
	// replace(v: T): Option<T> {
	// 	throw new Error("Method not implemented.")
	// }
	// zip<U extends NonUndefined>(other: Option<U>): Option<[T, U]> {
	// 	throw new Error("Method not implemented.")
	// }
	// zip_with<U extends NonUndefined, R extends NonUndefined>(
	// 	other: Option<U>,
	// 	f: (a: T, b: U) => R
	// ): Option<R> {
	// 	throw new Error("Method not implemented.")
	// }
	// transpose(): Result<Option<NonUndefined>, NonUndefined> {
	// 	throw new Error("Method not implemented.")
	// }
	// flatten(): Option<NonUndefined> {
	// 	throw new Error("Method not implemented.")
	// }
}

function un_zip<T extends NonUndefined, U extends NonUndefined>(
	opt: Option<[T, U]>
): [Option<T>, Option<U>] {
	return opt.match({
		some: ([a, b]) => [new Some(a) as Option<T>, new Some(b) as Option<U>],
		none: () => [none(), none()],
	})
}

function some<T extends NonUndefined>(v: T): Some<T> {
	return new Some(v)
}
function none(): None {
	return new None()
}

const s = new Some(1) as Option<number>

const ss = s.inspect(() => console.log("hello"))
