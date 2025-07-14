import type { ParentProps } from "solid-js"

export function InfoLabel(props: ParentProps) {
	return <span class="text-sm text-tertiary">{props.children}</span>
}
