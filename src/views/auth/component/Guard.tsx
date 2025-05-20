import { Show, type ParentProps } from "solid-js"
import { Navigate } from "@tanstack/solid-router"
import { useUserCtx } from "~/state/user"

export function Guard(props: ParentProps) {
	return (
		<Show
			when={!useUserCtx().is_signed_in}
			fallback={<Navigate to="/" />}
		>
			{props.children}
		</Show>
	)
}