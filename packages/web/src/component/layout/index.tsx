import { type ComponentProps, createMemo, splitProps } from "solid-js"
import { Dynamic } from "solid-js/web"
import { twMerge } from "tailwind-merge"

export type StackProps<P = ComponentProps<"div" | "span">> = {
	[K in keyof P]: P[K]
} & {
	as?: "div" | "span" | undefined
}

export function VStack(props: StackProps) {
	const twClass = createMemo(() => twMerge(props.class, "flex flex-col"))

	const [, otherProps] = splitProps(props, ["class", "as"])

	return (
		<Dynamic
			component={props.as ?? "div"}
			class={twClass()}
			{...otherProps}
		/>
	)
}

export function HStack(props: StackProps) {
	const twClass = createMemo(() => twMerge(props.class, "flex flex-row"))

	const [, otherProps] = splitProps(props, ["class", "as"])

	return (
		<Dynamic
			component={props.as ?? "div"}
			class={twClass()}
			{...otherProps}
		/>
	)
}
