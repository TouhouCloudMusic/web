import type { PolymorphicProps } from "@kobalte/core"
import * as K_Tab from "@kobalte/core/tabs"
import { mergeProps } from "solid-js"
import { twMerge } from "tailwind-merge"

import { Button } from "~/components/button"

export function Root(
	props: PolymorphicProps<"div", K_Tab.TabsRootProps<"div">>,
) {
	return <K_Tab.Root {...props} />
}

export function List(props: PolymorphicProps<"ul", K_Tab.TabsListProps<"ul">>) {
	const finalProps = mergeProps(props, {
		get class() {
			return twMerge("relative", props.class)
		},
	})
	return (
		<K_Tab.List
			as="ul"
			{...finalProps}
		/>
	)
}

export function Trigger(
	props: PolymorphicProps<typeof Button, K_Tab.TabsTriggerProps<typeof Button>>,
) {
	const finalProps = mergeProps(props, {
		get class() {
			return twMerge(
				"p-0 duration-100 hover:bg-slate-50 active:bg-slate-200/50 rounded-none",
				props.class,
			)
		},
	})

	return (
		<K_Tab.Trigger
			as={Button}
			variant="Tertiary"
			{...finalProps}
		/>
	)
}

export function Content(
	props: PolymorphicProps<"div", K_Tab.TabsContentProps<"div">>,
) {
	return <K_Tab.Content {...props} />
}

export function Indicator(
	props: PolymorphicProps<"div", K_Tab.TabsIndicatorProps<"div">>,
) {
	const finalProps = mergeProps(props, {
		get class() {
			return twMerge(
				"absolute bottom-[-1px] h-[2px] bg-reimu-600 duration-150",
				props.class,
			)
		},
	})
	return <K_Tab.Indicator {...finalProps} />
}
