import { NonUndefined } from "./base"
import { Option } from "./option"
export interface HKT {
	readonly param: symbol
	readonly result: unknown
}

export type Apply<F extends HKT, A> = (F & { param: A })["result"]

export interface Functor<F extends HKT> {
	readonly map: <A, B>(fa: Apply<F, A>, f: (a: A) => B) => Apply<F, B>
}

const someSymbol = Symbol("some")
const noneSymbol = Symbol("none")

interface Some<T extends NonUndefined> {
	readonly URI: typeof someSymbol
	readonly val: T
	is_some(): this is Some<T>
	is_none(): this is None
}

interface None {
	readonly URI: typeof noneSymbol
	readonly val: undefined
	is_some<T extends NonUndefined>(): this is Some<T>
	is_none(): this is None
	and<U extends NonUndefined>(optb: Option<U>): None
}

type Option<T extends NonUndefined> = Some<T> | None

interface OptionHKT extends HKT {
	result: Option<this["param"]>
}
