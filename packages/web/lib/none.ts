import { NonUndefined } from "./base"
import { Some } from "./some"
import { Option, noneSymbol, Match } from "./option"

export interface None extends Option<NonUndefined> {
	URI: typeof noneSymbol
	and<U extends NonUndefined>(this: None, optb: Option<U>): None
	and_then<T extends NonUndefined, U extends NonUndefined>(
		this: None,
		f: (v: T) => U
	): None
	expect(msg: string): never
	filter<T extends NonUndefined>(this: None, f: (v: T) => boolean): None
	flatten(this: None): None
	inspect<T extends NonUndefined>(this: None, f: (v: T) => void): None
	is_some<T extends NonUndefined>(this: Option<T>): this is Some<T>
	is_none<T extends NonUndefined>(this: Option<T>): this is None

	map<T extends None>(this: None, f: (v: T) => None): None

	map_or<T extends None, U extends NonUndefined>(
		this: None,
		optb: U,
		f: (v: T) => None
	): U

	map_or_else<T extends None, U extends NonUndefined>(
		this: None,
		optb: () => U,
		f: (v: T) => None
	): U

	match<T extends NonUndefined, U extends NonUndefined, V>(
		this: None,
		m: Match<T, U, V extends CallableFunction ? () => V : V>
	): V

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
	unwrap(): never
	unwrap_or<T extends NonUndefined>(optb: T): T
}
