import type { VoidFn } from "./types"

export type DebouncedFn = {
	(): void
	cancel(): void
}
export function debounce(timeout: number): (fn: VoidFn) => DebouncedFn
export function debounce(fn: VoidFn): (timeout: number) => DebouncedFn
export function debounce(fn: VoidFn, timeout: number): DebouncedFn
export function debounce(timeout: number, fn: VoidFn): DebouncedFn
export function debounce(
	arg1: number | VoidFn,
	arg2?: number | VoidFn,
	// oxlint-disable-next-line no-explicit-any
): any {
	// oxlint-disable-next-line no-undef
	const argsLength = arguments.length

	if (argsLength === 2) {
		if (typeof arg1 === "number") {
			return createDebounced(arg2 as VoidFn, arg1)
		} else if (typeof arg1 === "function") {
			return createDebounced(arg1, arg2 as number)
		}
	} else if (argsLength === 1) {
		if (typeof arg1 === "number") {
			return (fn: VoidFn) => createDebounced(fn, arg1)
		} else if (typeof arg1 === "function") {
			return (timeout: number) => createDebounced(arg1, timeout)
		}
	}
}

function createDebounced(fn: VoidFn, timeout: number): DebouncedFn {
	let timer: ReturnType<typeof setTimeout> | null = null
	return Object.assign(
		() => {
			if (timer) {
				clearTimeout(timer)
			}
			timer = setTimeout(fn, timeout)
		},
		{
			cancel() {
				if (timer) {
					clearTimeout(timer)
				}
			},
		},
	)
}
