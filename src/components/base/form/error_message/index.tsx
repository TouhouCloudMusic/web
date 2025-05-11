import { type JSX, mergeProps, Show } from "solid-js"
import { twMerge } from "tailwind-merge"

const CLASS_NAME = "text-reimu-700 text-sm mt-2"

export function ErrorMessage(
	props: Omit<JSX.HTMLAttributes<HTMLSpanElement>, "children"> & {
		message?: string | undefined
	},
) {
	const localProps = mergeProps(props, {
		get class() {
			return props.class ? twMerge(CLASS_NAME, props.class) : CLASS_NAME
		},
	})
	return (
		<Show when={props.message}>
			<span {...localProps}></span>
		</Show>
	)
}
