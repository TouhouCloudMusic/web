/* eslint-disable jsx-a11y/label-has-associated-control */
import { mergeProps, type ComponentProps } from "solid-js"
import { twMerge } from "tailwind-merge"

export type __LabelProps = ComponentProps<"label">

export const LABEL_CLASSNAME = "font-inter font-medium leading-6"

export function __Label(props: __LabelProps) {
	const localProps = mergeProps(props, {
		get class() {
			return props.class ?
					twMerge(LABEL_CLASSNAME, props.class)
				:	LABEL_CLASSNAME
		},
	})

	return <label {...localProps}></label>
}
