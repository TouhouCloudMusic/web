import type { PolymorphicProps } from "@kobalte/core"
import * as K_Tab from "@kobalte/core/tabs"
import { createContext, createEffect, mergeProps } from "solid-js"
import { createStore } from "solid-js/store"
import { twMerge } from "tailwind-merge"

import { Button } from "~/components/button"
import { assertContext } from "~/utils/context"

export type RootProps = PolymorphicProps<"div", K_Tab.TabsRootProps<"div">>

type IndicatorPosition = "bottom" | "top" | "left" | "right"

type Context = (
	| {
			orientation: "horizontal"
			indicatorPosition: "bottom" | "top"
	  }
	| {
			orientation: "vertical"
			indicatorPosition: "left" | "right"
	  }
) & {
	setIndicatorPosition(val: IndicatorPosition): void
}
const Context = createContext<Context>()

export function Root(props: RootProps) {
	const [store, setStore] = createStore<{
		indicatorPosition?: IndicatorPosition
	}>({})

	return (
		<Context.Provider
			value={
				{
					get orientation() {
						return props.orientation ?? "horizontal"
					},
					get indicatorPosition() {
						return store.indicatorPosition
					},
					setIndicatorPosition(val: IndicatorPosition) {
						setStore("indicatorPosition", val)
					},
				} as Context
			}
		>
			<K_Tab.Root {...props} />
		</Context.Provider>
	)
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

export type IndicatorProps = PolymorphicProps<
	"div",
	K_Tab.TabsIndicatorProps<"div">
> & {
	position?: IndicatorPosition
}

export function Indicator(props: IndicatorProps) {
	const context = assertContext(Context)

	createEffect(() => {
		context.setIndicatorPosition(
			(props.position ?? context.orientation == "horizontal") ?
				"bottom"
			:	"left",
		)
	})

	const finalProps = mergeProps(props, {
		get class() {
			const positionClass = () => {
				switch (context.indicatorPosition) {
					case "bottom":
						return "bottom-[-1px] h-[2px]"
					case "top":
						return "top-[-1px] h-[2px]"
					case "left":
						return "left-[-1px] w-[2px]"
					case "right":
						return "right-[-1px] w-[2px]"
					default:
						return ""
				}
			}

			return twMerge(
				positionClass(),
				"absolute bg-reimu-600 duration-150",
				props.class,
			)
		},
	})
	return <K_Tab.Indicator {...finalProps} />
}
