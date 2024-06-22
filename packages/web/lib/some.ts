import { NonUndefined } from "./base"
import { Option, someSymbol, Match } from "./option"
import { None } from "./none"

export interface Some<T extends NonUndefined> extends Option<T> {
	URI: typeof someSymbol
	and<U extends NonUndefined>(optb: Some<U>): Some<U>
	and<U extends NonUndefined>(optb: Option<U>): Option<U>

	and_then<T extends NonUndefined, U extends NonUndefined>(
		this: Some<T>,
		f: (v: T) => U
	): Some<U>
	and_then<T extends NonUndefined, U extends NonUndefined>(
		this: Option<T>,
		f: (v: T) => U
	): Option<U>

	expect(msg: string): T

	filter<T extends NonUndefined>(this: Some<T>, f: (v: T) => true): Some<T>
	filter<T extends NonUndefined>(this: Some<T>, f: (v: T) => false): None
	filter<T extends NonUndefined>(
		this: Option<T>,
		f: (v: T) => boolean
	): Option<T>

	flatten<T extends None>(this: Some<T>): None
	flatten<T extends Some<NonUndefined>>(this: Some<T>): T
	flatten<T extends NonUndefined>(this: Some<Option<T>>): Option<T>

	inspect<T extends NonUndefined>(this: Some<T>, f: (v: T) => void): Some<T>

	is_some<T extends NonUndefined>(this: Option<T>): this is Some<T>
	is_none<T extends NonUndefined>(this: Option<T>): this is None

	map<T extends NonUndefined, U extends NonUndefined>(
		this: Some<T>,
		f: (v: T) => U
	): Some<U>

	map_or<
		T extends NonUndefined,
		U extends NonUndefined,
		V extends NonUndefined,
	>(
		this: Some<T>,
		optb: U,
		f: (v: T) => V
	): V

	map_or_else<
		T extends NonUndefined,
		U extends NonUndefined,
		V extends NonUndefined,
	>(
		this: Some<T>,
		optb: () => U,
		f: (v: T) => V
	): V

	match<T extends NonUndefined, U extends NonUndefined, V>(
		this: Some<T>,
		m: Match<T, U, V extends CallableFunction ? () => V : V>
	): U

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
	unwrap(): T
	unwrap_or<T extends NonUndefined, U extends NonUndefined>(
		this: Some<T>,
		optb: U
	): T
}
