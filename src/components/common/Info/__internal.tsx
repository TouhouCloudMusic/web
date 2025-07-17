import type { ComponentProps, ParentProps } from "solid-js"
import { mergeProps } from "solid-js"
import { twMerge } from "tailwind-merge"

type ListProps = ParentProps<ComponentProps<"div">>

const LIST_CLASS = ""

export function List(props: ListProps) {
	let finalProps = mergeProps(props, {
		get class() {
			if (props.class) {
				return twMerge(LIST_CLASS, props.class)
			}

			return LIST_CLASS
		},
	})
	return <div {...finalProps}></div>
}

type ItemProps = ComponentProps<"div">

const ITEM_CLASS = ""

export function Item(props: ItemProps) {
	let finalProps = mergeProps(props, {
		get class() {
			if (props.class) {
				return twMerge(ITEM_CLASS, props.class)
			}

			return ITEM_CLASS
		},
	})
	return <div {...finalProps}></div>
}

type LabelProps = ParentProps<ComponentProps<"div">>

const LABEL_CLASS = "text-sm text-tertiary"

export function Label(props: LabelProps) {
	let finalProps = mergeProps(props, {
		get class() {
			if (props.class) {
				return twMerge(LABEL_CLASS, props.class)
			}

			return LABEL_CLASS
		},
	})
	return <div {...finalProps}></div>
}

type DetailProps = ParentProps<ComponentProps<"div">>

const DETAIL_CLASS = "text-slate-1000"

export function Detail(props: DetailProps) {
	let finalProps = mergeProps(props, {
		get class() {
			if (props.class) {
				return twMerge(DETAIL_CLASS, props.class)
			}

			return DETAIL_CLASS
		},
	})
	return <div {...finalProps}></div>
}
