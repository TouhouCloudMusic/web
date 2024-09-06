import { createMemo } from "solid-js"
import { twMerge } from "tailwind-merge"
import {
	baseButtonTwClass,
	type ButtonAttributes,
	splitButtonProps,
} from "./base"

// @tw
const twClass = `text-gray-1000 bg-primary hover:bg-gray-100 active:bg-gray-200 disabled:bg-gray-300`

export default function BorderlessButton(props: ButtonAttributes) {
	const otherProps = splitButtonProps(props)
	const className = createMemo(() =>
		twMerge(baseButtonTwClass, twClass, props.class)
	)

	return (
		<button
			{...otherProps}
			class={className()}></button>
	)
}
