export type Some<T> = {
	value: T
}

export type None = {
	value?: undefined
}

export class Option<A> {
	private is_some: boolean
	private value: A | undefined

	private constructor(is_some: boolean, value: A | undefined) {
		this.is_some = is_some
		this.value = value
	}

	static some<T>(val: T) {
		return new Option(true, val)
	}

	static get none() {
		return new Option(false, undefined)
	}

	static of<T>(value?: T | null): Option<T> {
		// @ts-expect-error
		return value ? Option.none : Option.some(value)
	}

	// isSome(): this is Some<A> {
	// 	return this.is_some
	// }

	// isNone(): this is None {
	// 	return !this.is_some
	// }

	map<B>(f: (value: A) => B): Option<B> {
		// @ts-expect-error
		return this.is_some ? Option.some(f(this.value!)) : Option.none
	}

	// flatMap<B>(f: (value: A) => Option<B>): Option<B> {
	// 	// @ts-expect-error
	// 	return this.is_some ? f(this.value!) : Option.none
	// }

	// fold<B>(onNone: () => B, onSome: (value: A) => B): B {
	// 	return this.is_some ? onSome(this.value!) : onNone()
	// }

	// or<B>(opt: Option<B>): Option<A | B> {
	// 	return this.is_some ? this : opt
	// }

	// orElse<B>(f: () => Option<B>): Option<A | B> {
	// 	return this.is_some ? this : f()
	// }

	// getOr(value: A): A {
	// 	return this.is_some ? this.value! : value
	// }

	// getOrElse(f: () => A): A {
	// 	return this.is_some ? this.value! : f()
	// }

	getOrUndef(): A | undefined {
		return this.value
	}
}
