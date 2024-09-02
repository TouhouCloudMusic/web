import { createMemo, splitProps } from "solid-js"
import { Dynamic, type DynamicProps } from "solid-js/web"
import { twMerge } from "tailwind-merge"

export type StackProps = Omit<DynamicProps<"div">, "component">

export function VStack(props: StackProps) {
	const twClass = createMemo(() => twMerge(props.class, "flex flex-col"))

	const [, otherProps] = splitProps(props, ["class"])

	return (
		<Dynamic
			{...otherProps}
			component={"div"}
			class={twClass()}
		/>
	)
}

export function HStack(props: StackProps) {
	const twClass = createMemo(() => twMerge(props.class, "flex flex-row"))

	const [, otherProps] = splitProps(props, ["class"])

	return (
		<Dynamic
			{...otherProps}
			component={"div"}
			class={twClass()}
		/>
	)
}
