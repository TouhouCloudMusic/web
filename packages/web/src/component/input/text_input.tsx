import { createMemo, splitProps, type JSX } from "solid-js"
import { twMerge } from "tailwind-merge"

// @tw
const style = "rounded border-[0.1rem] border-gray-300 px-1 h-fit"

export function TextInput(
	props: Omit<JSX.InputHTMLAttributes<HTMLInputElement>, "type">
) {
	const [, otherProps] = splitProps(props, ["class"])

	const twClass = createMemo(() => twMerge(style, props.class))

	return (
		<input
			type="text"
			class={twClass()}
			{...otherProps}
		/>
	)
}
