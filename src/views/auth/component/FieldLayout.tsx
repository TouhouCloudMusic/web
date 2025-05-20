import { type ParentProps } from "solid-js"
import { FieldError } from "./FieldError"

export function FieldLayout(
	props: ParentProps<{
		label: string
		for: string
		error?: string
	}>,
) {
	return (
		<div class="flex flex-col gap-2">
			<label for={props.for}>{props.label}</label>
			{props.children}
			{props.error && <FieldError>{props.error}</FieldError>}
		</div>
	)
}