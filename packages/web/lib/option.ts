import { NonUndefined } from "./base"
import { Result } from "./result"
import { default_constructor } from "./default"
import { Some } from "./some"
import { None } from "./none"
const unwrapMsg = "Unable to unwrap value from None"
export interface Match<A, B, C> {
	some: (v: A) => B
	none: (() => C) | C
}
export const someSymbol = Symbol("some")
export const noneSymbol = Symbol("none")

export function some<T extends NonUndefined>(v: T): Some<T> {
	return new OptionImpl(v) as Some<T>
}
export function none(): None {
	return new OptionImpl() as unknown as None
}
export function option<T extends NonUndefined>(v?: T): Option<T> {
	return new OptionImpl(v)
}

class OptionImpl<T extends NonUndefined> implements Option<T> {
	private default: T | undefined
	URI: typeof someSymbol | typeof noneSymbol
	constructor(private readonly val?: T) {
		if (val !== undefined) {
			this.URI = someSymbol
			this.default = default_constructor(val)
		} else this.URI = noneSymbol
	}
	and<U extends NonUndefined>(optb: Some<U>): Option<U>
	and<U extends NonUndefined>(optb: Option<U>): Option<U> {
		if (this.is_some()) return optb
		else return none()
	}

	and_then<T extends NonUndefined, U extends NonUndefined>(
		this: Option<T>,
		f: (v: T) => U
	): Option<U>
	and_then<T extends NonUndefined, U extends NonUndefined>(
		this: Option<T>,
		f: (v: T) => U
	): Option<U> {
		if (this.URI === someSymbol)
			return some(f((this as OptionImpl<T>).val as T))
		else return none()
	}

	expect(msg: string): T | never {
		if (this.URI === noneSymbol) throw new Error(msg)
		else return this.val as T
	}

	filter<T extends NonUndefined>(this: Option<T>, f: (v: T) => true): Option<T>
	filter<T extends NonUndefined>(this: Option<T>, f: (v: T) => false): None
	filter<T extends NonUndefined>(
		this: Option<T>,
		f: (v: T) => boolean
	): Option<T> {
		if (this.URI === noneSymbol) return none()
		return f((this as unknown as OptionImpl<T>).val as T) ? this : none()
	}

	flatten<T extends Option<NonUndefined>>(this: Option<T>): T
	flatten<T extends NonUndefined>(this: Option<Option<T>>): Option<T> {
		if (this.URI === noneSymbol || this.unwrap().URI === noneSymbol)
			return none()
		else return this.unwrap()
	}

	inspect<T extends NonUndefined>(
		this: Option<T>,
		f: (v: T) => void
	): Option<T> {
		if (this.URI === someSymbol) f((this as OptionImpl<T>).val as T)
		return this
	}

	is_some<T extends NonUndefined>(this: Option<T>): this is Some<T> {
		return this.URI === someSymbol
	}
	is_none<T extends NonUndefined>(this: Option<T>): this is None {
		return this.URI === noneSymbol
	}

	map<T extends NonUndefined, U extends NonUndefined>(
		this: Option<T>,
		f: (v: T) => U
	): Option<U> {
		if (this.URI === someSymbol)
			return some(f((this as OptionImpl<T>).val as T))
		else return none()
	}

	map_or<
		T extends NonUndefined,
		U extends NonUndefined,
		V extends NonUndefined,
	>(this: Option<T>, optb: U, f: (v: T) => V): U | V {
		if (this.URI === someSymbol) return f((this as OptionImpl<T>).val as T)
		else return optb
	}
	map_or_else<
		T extends NonUndefined,
		U extends NonUndefined,
		V extends NonUndefined,
	>(this: Option<T>, optb: () => U, f: (v: T) => V): U | V {
		if (this.URI === someSymbol) return f((this as OptionImpl<T>).val as T)
		else return optb()
	}

	match<T extends NonUndefined, U extends NonUndefined, V>(
		this: Option<T>,
		m: Match<T, U, V extends CallableFunction ? () => V : V>
	): U | V {
		if (this.URI === noneSymbol) {
			if (typeof none === "function") {
				return (m.none as () => V)()
			} else return m.none as V
		} else return m.some((this as OptionImpl<T>).val as T)
	}

	ok_or<T extends NonUndefined, E extends NonUndefined>(
		this: Option<T>,
		err: E
	): Result<T, E> {
		throw new Error("Method not implemented.")
	}
	ok_or_else<T extends NonUndefined, E extends NonUndefined>(
		this: Option<T>,
		f: () => E
	): Result<T, E> {
		throw new Error("Method not implemented.")
	}
	or<T extends NonUndefined>(this: Option<T>, optb: Option<T>): Option<T> {
		throw new Error("Method not implemented.")
	}
	or_else<T extends NonUndefined>(
		this: Option<T>,
		optb: () => Option<T>
	): Option<T> {
		throw new Error("Method not implemented.")
	}
	replace<T extends NonUndefined>(this: Option<T>, v: T): Option<T> {
		throw new Error("Method not implemented.")
	}
	transpose<T extends NonUndefined>(
		this: Option<T>
	): Result<Option<T>, NonUndefined> {
		throw new Error("Method not implemented.")
	}

	unwrap(): T | never {
		if (this.URI === someSymbol) return this.val as T
		else throw new Error(unwrapMsg)
	}

	unwrap_or<T extends NonUndefined>(optb: T): T {
		if (this.URI === someSymbol) return this.val as unknown as T
		else return optb
	}
	unwrap_or_else<T extends NonUndefined>(f: () => T): T {
		throw new Error("Method not implemented.")
	}
	unwrap_unchecked(): T {
		throw new Error("Method not implemented.")
	}
	xor<T extends NonUndefined>(this: Option<T>, optb: Option<T>): Option<T> {
		throw new Error("Method not implemented.")
	}
	zip<T extends NonUndefined, U extends NonUndefined>(
		this: Option<T>,
		other: Option<U>
	): Option<[T, U]> {
		throw new Error("Method not implemented.")
	}
	zip_with<
		T extends NonUndefined,
		U extends NonUndefined,
		R extends NonUndefined,
	>(this: Option<T>, other: Option<U>, f: (a: T, b: U) => R): Option<R> {
		throw new Error("Method not implemented.")
	}
}

export interface Option<T extends NonUndefined> {
	URI: typeof someSymbol | typeof noneSymbol
	and<U extends NonUndefined>(optb: Some<U>): Option<U>
	and<U extends NonUndefined>(optb: Option<U>): Option<U>

	and_then<T extends NonUndefined, U extends NonUndefined>(
		this: Option<T>,
		f: (v: T) => U
	): Option<U>
	and_then<T extends NonUndefined, U extends NonUndefined>(
		this: Option<T>,
		f: (v: T) => U
	): Option<U>

	expect(msg: string): T | never

	filter<T extends NonUndefined>(this: Option<T>, f: (v: T) => true): Option<T>
	filter<T extends NonUndefined>(this: Option<T>, f: (v: T) => false): None
	filter<T extends NonUndefined>(
		this: Option<T>,
		f: (v: T) => boolean
	): Option<T>

	flatten<T extends Option<NonUndefined>>(this: Option<T>): T
	flatten<T extends NonUndefined>(this: Option<Option<T>>): Option<T>

	inspect<T extends NonUndefined>(this: Option<T>, f: (v: T) => void): Option<T>

	is_some<T extends NonUndefined>(this: Option<T>): this is Some<T>
	is_none<T extends NonUndefined>(this: Option<T>): this is None

	map<T extends NonUndefined, U extends NonUndefined>(
		this: Option<T>,
		f: (v: T) => U
	): Option<U>

	map_or<
		T extends NonUndefined,
		U extends NonUndefined,
		V extends NonUndefined,
	>(
		this: Option<T>,
		optb: U,
		f: (v: T) => V
	): U | V

	map_or_else<
		T extends NonUndefined,
		U extends NonUndefined,
		V extends NonUndefined,
	>(
		this: Option<T>,
		optb: () => U,
		f: (v: T) => V
	): U | V

	match<T extends NonUndefined, U extends NonUndefined, V>(
		this: Option<T>,
		m: Match<T, U, V extends CallableFunction ? () => V : V>
	): U | V

	// ok_or<T extends NonUndefined, E extends NonUndefined>(
	// 	this: Option<T>,
	// 	err: E
	// ): Result<T, E>
	// ok_or_else<T extends NonUndefined, E extends NonUndefined>(
	// 	this: Option<T>,
	// 	f: () => E
	// ): Result<T, E>
	// or<T extends NonUndefined>(this: Option<T>, optb: Option<T>): Option<T>
	// or_else<T extends NonUndefined>(
	// 	this: Option<T>,
	// 	optb: () => Option<T>
	// ): Option<T>
	// replace<T extends NonUndefined>(this: Option<T>, v: T): Option<T>
	// transpose<T extends NonUndefined>(
	// 	this: Option<T>
	// ): Result<Option<T>, NonUndefined>

	unwrap(): T | never

	unwrap_or<T extends NonUndefined>(optb: T): T
	// unwrap_or_else<T extends NonUndefined>(f: () => T): T
	// unwrap_unchecked(): T | never
	// xor<T extends NonUndefined>(this: Option<T>, optb: Option<T>): Option<T>
	// zip<T extends NonUndefined, U extends NonUndefined>(
	// 	this: Option<T>,
	// 	other: Option<U>
	// ): Option<[T, U]>
	// zip_with<
	// 	T extends NonUndefined,
	// 	U extends NonUndefined,
	// 	R extends NonUndefined,
	// >(
	// 	this: Option<T>,
	// 	other: Option<U>,
	// 	f: (a: T, b: U) => R
	// ): Option<R>

	// insert(v: T): (arg: T) => T
	// get_or_insert(v: T): (...args: [T] | []) => T
	// get_or_insert_default(): (...args: [T] | []) => T
	// get_or_insert_with(f: () => T): (...args: [T] | []) => T
}
