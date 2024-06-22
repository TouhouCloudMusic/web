/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-redundant-type-constituents */
import { NonUndefined } from "./base"
import { option, some, Option, none } from "./option"
import { None } from "./none"
import { Some } from "./some"
import { describe, expect, expectTypeOf, test, vi } from "vitest"

describe("Option", () => {
	const foo = option(1)
	expectTypeOf(foo).toMatchTypeOf<Option<1>>()
	test("and", () => {
		expectTypeOf(foo.and(some("2"))).toMatchTypeOf<Option<"2">>()
	})
	test("and_then", () => {
		expectTypeOf(foo.and_then((c) => c++)).toMatchTypeOf<Option<number>>()
	})
	test("expect", () => {
		expectTypeOf(foo.expect("err")).toMatchTypeOf<NonUndefined | never>()
	})
	test("filter if true", () => {
		expectTypeOf(foo.filter(() => true)).toMatchTypeOf<Option<1>>()
	})
	test("filter if false", () => {
		const bar = foo.filter(() => false)
		expectTypeOf(bar).toMatchTypeOf<None>()
	})
	test("flatten option* contain option", () => {
		const foo = option(option(2))
		const bar = foo.flatten()
		expectTypeOf(bar).toMatchTypeOf<Option<2>>()
	})
	test("flatten option* contain some", () => {
		const foo = option(some(2))
		const bar = foo.flatten()
		expectTypeOf(bar).toMatchTypeOf<Some<2>>()
	})
	test("flatten option* contain none", () => {
		const foo = option(none())
		const bar = foo.flatten()
		expectTypeOf(bar).toMatchTypeOf<None>()
	})
	test("flatten option*2 contain option", () => {
		const foo = option(option(option(2)))
		const bar = foo.flatten().flatten()
		expectTypeOf(bar).toMatchTypeOf<Option<2>>()
	})
	test("flatten option*2 contain some", () => {
		const foo = option(option(some(2)))
		const bar = foo.flatten().flatten()
		expectTypeOf(bar).toMatchTypeOf<Some<2>>()
	})
	test("flatten option*2 contain none", () => {
		const foo = option(option(none()))
		const bar = foo.flatten().flatten()
		expectTypeOf(bar).toMatchTypeOf<None>()
	})
	test("inspect", () => {
		const foo = option(1)
		const spy = {
			log(v: number) {
				console.log(v)
			},
		}
		const bar = foo.inspect((_c) => spy.log(0))
		expect(vi.spyOn(spy, "log")).not.toHaveBeenCalled()
		expectTypeOf(bar).toMatchTypeOf<Option<1>>()
	})
	test("map", () => {
		const foo = option(0)
		const bar = foo.map((x) => x + 1)
		expectTypeOf(bar).toMatchTypeOf<Option<number>>()
		expect(bar.unwrap()).toBe(1)
	})
	test("map_or", () => {
		const foo = option(0)
		const bar = foo.map_or("233", (x) => x + 2)
		expectTypeOf(bar).toMatchTypeOf<number | string>()
		expect(bar).toBe(2)
	})
	test("map_or_else", () => {
		const foo = option(0)
		const bar = foo.map_or_else(
			() => 233,
			(x) => x.toString()
		)
		expectTypeOf(bar).toMatchTypeOf<string | number>()
		expect(bar).toBe("0")
	})
	test("match option contain value", () => {
		const foo = option(0)
		const bar = foo.match({
			some: (x) => x + 1,
			none: () => "233",
		})
		expectTypeOf(bar).toMatchTypeOf<number | string>()
		expect(bar).toBe(1)
	})
	test("match option, same type", () => {
		const foo = option<number>()
		const bar = foo.match({
			some: (x) => x + 1,
			none: () => 233,
		})
		expectTypeOf(bar).toMatchTypeOf<number>()
		expect(bar).toBe(233)
	})
	test("match option, different type", () => {
		const foo = option<number>()
		const bar = foo.match({
			some: (x) => x + 1,
			none: () => "233",
		})
		expectTypeOf(bar).toMatchTypeOf<number | string>()
		expect(bar).toBe("233")
	})
	test("match option contain none", () => {
		const foo = option(none())
		const bar = foo.match({
			some: (x) => x,
			none: () => "233",
		})
		expectTypeOf(bar).toMatchTypeOf<string | None>()
		expect(bar).toEqual(none())
	})
})

describe("Some", () => {
	const foo = some(1)
	expectTypeOf(foo).toMatchTypeOf<Some<1>>()
	test("and", () => {
		const bar = foo.and(some("2"))
		expectTypeOf(bar).toMatchTypeOf<Some<"2">>()
	})
	test("and_then", () => {
		const bar = foo.and_then((v: number) => v++)
		expectTypeOf(bar).toMatchTypeOf<Some<number>>()
	})
	test("expect", () => {
		expectTypeOf(foo.expect("err")).toMatchTypeOf<NonUndefined>()
	})
	test("filter if true", () => {
		expectTypeOf(foo.filter(() => true)).toMatchTypeOf<Some<1>>()
	})
	test("filter if false", () => {
		const bar = foo.filter(() => false)
		expectTypeOf(bar).toMatchTypeOf<None>()
	})
	test("flatten some contain option", () => {
		const foo = some(option(2))
		const bar = foo.flatten()
		expectTypeOf(bar).toMatchTypeOf<Option<2>>()
	})
	test("flatten some contain some", () => {
		const foo = some(some(2))
		const bar = foo.flatten()
		expectTypeOf(bar).toMatchTypeOf<Some<2>>()
	})
	test("flatten some contain none", () => {
		const foo = some(none())
		const bar = foo.flatten()
		expectTypeOf(bar).toMatchTypeOf<None>()
	})
	test("flatten some*2 contain option", () => {
		const foo = some(some(option(2)))
		const bar = foo.flatten().flatten()
		expectTypeOf(bar).toMatchTypeOf<Option<2>>()
	})
	test("flatten some*2 contain some", () => {
		const foo = some(some(some(2)))
		const bar = foo.flatten().flatten()
		expectTypeOf(bar).toMatchTypeOf<Some<2>>()
	})
	test("flatten some*2 contain none", () => {
		const foo = some(some(none()))
		const bar = foo.flatten().flatten()
		expectTypeOf(bar).toMatchTypeOf<None>()
	})
	test("inspect", () => {
		const foo = some(1)
		const spy = {
			log(v: number) {
				console.log(v)
			},
		}
		const bar = foo.inspect((c) => spy.log(c))
		expect(vi.spyOn(spy, "log")).not.toHaveBeenCalled()
		expectTypeOf(bar).toMatchTypeOf<Some<1>>()
	})
	test("map", () => {
		const foo = some(0)
		const bar = foo.map((x) => x + 2)
		expectTypeOf(bar).toMatchTypeOf<Some<number>>()
		expect(bar.unwrap()).toBe(2)
	})
	test("map_or", () => {
		const foo = some(0)
		const bar = foo.map_or(233, (x) => x + 2)
		expectTypeOf(bar).toMatchTypeOf<number>()
		expect(bar).toBe(2)
	})
	test("map_or_else", () => {
		const foo = some(0)
		const bar = foo.map_or_else(
			() => 233,
			(x) => x + 2
		)
		expectTypeOf(bar).toMatchTypeOf<number>()
		expect(bar).toBe(2)
	})
	test("match some contain value", () => {
		const foo = some(0)
		const bar = foo.match({
			some: (x) => x + 1,
			none: () => "233",
		})
		expectTypeOf(bar).toMatchTypeOf<number>()
		expect(bar).toBe(1)
	})
	test("match some contain none", () => {
		const foo = some(none())
		const bar = foo.match({
			some: (x) => x,
			none: () => "233",
		})
		expectTypeOf(bar).toMatchTypeOf<None>()
		expect(bar).toEqual(none())
	})
	test("match some contain option", () => {
		const foo = some(option(option<number>()))
		const bar = foo.match({
			some: (x) => x,
			none: () => "foo",
		})
		expectTypeOf(bar).toMatchTypeOf<Option<Option<number>>>()
		const baz = bar.match({
			some: (x) => x,
			none: () => "foo",
		})
		expectTypeOf(baz).toMatchTypeOf<string | Option<number>>()
		expect(baz).toEqual(none())
	})
})

describe("None", () => {
	const foo = none()
	expectTypeOf(foo).toMatchTypeOf<None>()
	test("and", () => {
		expectTypeOf(foo.and(some("2"))).toMatchTypeOf<None>()
	})
	test("and_then", () => {
		const bar = foo.and_then((v: number) => v++)
		expectTypeOf(bar).toMatchTypeOf<None>()
	})
	test("expect", () => {
		expect(() => foo.expect("err")).toThrowError("err")
	})
	test("filter if true", () => {
		const bar = foo.filter(() => true)
		expectTypeOf(bar).toMatchTypeOf<None>()
	})
	test("filter if false", () => {
		const bar = foo.filter(() => false)
		expectTypeOf(bar).toMatchTypeOf<None>()
	})
	test("flatten some contain value", () => {
		const foo = some(some(2))
		const bar = foo.flatten()
		expectTypeOf(bar).toMatchTypeOf<Some<2>>()
	})
	test("flatten none", () => {
		const foo = none()
		const bar = foo.flatten()
		expectTypeOf(bar).toMatchTypeOf<None>()
	})
	test("inspect none", () => {
		const foo = none()
		const spy = {
			log(v: number) {
				console.log(v)
			},
		}
		const bar = foo.inspect((_c) => spy.log(0))
		expect(vi.spyOn(spy, "log")).not.toHaveBeenCalled()
		expectTypeOf(bar).toMatchTypeOf<None>()
	})
	test("map", () => {
		const foo = none()
		const bar = foo.map((x) => x)
		expectTypeOf(bar).toMatchTypeOf<None>()
		expect(bar.unwrap_or(1)).toBe(1)
	})
	test("map_or", () => {
		const foo = none()
		const bar = foo.map_or(233, (x) => x)
		expectTypeOf(bar).toMatchTypeOf<number>()
		expect(bar).toBe(233)
	})
	test("map_or_else", () => {
		const foo = none()
		const bar = foo.map_or_else(
			() => 233,
			(_x) => _x
		)
		expectTypeOf(bar).toMatchTypeOf<number>()
		expect(bar).toBe(233)
	})
	test("match none", () => {
		const foo = none()
		const bar = foo.match({
			some: (_x) => _x,
			none: () => "233",
		})
		expectTypeOf(bar).toMatchTypeOf<string>()
		expect(bar).toBe("233")
	})
})
