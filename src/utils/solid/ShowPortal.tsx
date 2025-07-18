import type { Accessor, JSX } from "solid-js"
import { Show } from "solid-js"
import { Portal } from "solid-js/web"

type RequiredParameter<T> = T extends () => unknown ? never : T
/** @deprecated use `Show` with `Portal` instead */
export function ShowPortal<
	RenderFunction extends (item: Accessor<NonNullable<T>>) => JSX.Element,
	T extends boolean = false,
	S extends boolean = false,
>(props: {
	when: T | undefined | null | false
	keyed?: false
	fallback?: JSX.Element
	children: JSX.Element | RequiredParameter<RenderFunction>
	mount?: Node
	useShadow?: T
	isSVG?: S
	ref?:
		| (S extends true ? SVGGElement : HTMLDivElement)
		| ((
				el: (T extends true ?
					{
						readonly shadowRoot: ShadowRoot
					}
				:	NonNullable<unknown>) & // 原文： {}
					(S extends true ? SVGGElement : HTMLDivElement),
		  ) => void)
}): JSX.Element {
	return (
		<Portal
			mount={props.mount}
			useShadow={props.useShadow}
			isSVG={props.isSVG}
			ref={props.ref}
		>
			<Show
				when={props.when}
				keyed={props.keyed}
				fallback={props.fallback}
			>
				{props.children}
			</Show>
		</Portal>
	)
}
