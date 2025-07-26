import type { JSX } from "solid-js"
import { mergeProps } from "solid-js"
import { MagnifyingGlassIcon } from "solid-radix-icons"
import { twMerge } from "tailwind-merge"

import { Dialog } from ".."

export type RootProps = Dialog.RootProps

export function Root(props: RootProps) {
	return <Dialog.Root {...props} />
}

export type LabelProps = {
	children: JSX.Element
	class?: string
}

export function Label(props: LabelProps) {
	return (
		<Dialog.Title class={twMerge("text-lg font-medium", props.class)}>
			{props.children}
		</Dialog.Title>
	)
}

export type InputProps = JSX.InputHTMLAttributes<HTMLInputElement>

const INPUT_CLASS = `focus-within:rounded-md px-3 py-2 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none
border-0 bg-slate-100 pl-8 ring-0`

export function Input(props: InputProps) {
	const inputProps = mergeProps(props, {
		get class() {
			return props.class ? twMerge(INPUT_CLASS, props.class) : INPUT_CLASS
		},
	})
	return (
		<div class="relative">
			<MagnifyingGlassIcon class="absolute z-10 mx-auto size-4 w-8 self-center text-tertiary" />
			<input {...inputProps} />
		</div>
	)
}

const CONTENT_CLASS =
	"flex max-h-[min(48rem,50%)] min-h-128 max-w-sm flex-col px-0 pb-8"

export function Content(props: Dialog.ContentProps) {
	const finalProps = mergeProps(props, {
		get class() {
			return props.class ? twMerge(CONTENT_CLASS, props.class) : CONTENT_CLASS
		},
	})
	return (
		<Dialog.Portal>
			<Dialog.Overlay />
			<Dialog.Content {...finalProps} />
		</Dialog.Portal>
	)
}

export type ListProps = JSX.HTMLAttributes<HTMLUListElement>
const LIST_CLASS = "border-y-1.5 w-full overflow-auto px-4"
export function List(props: ListProps) {
	const listProps = mergeProps(props, {
		get class() {
			return props.class ? twMerge(LIST_CLASS, props.class) : LIST_CLASS
		},
	})
	return <ul {...listProps}></ul>
}
