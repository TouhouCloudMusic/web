import { type ParentProps } from "solid-js"

export function FieldError(props: ParentProps) {
	return <span class="text-sm text-reimu-700">{props.children}</span>
}