import { type JSX, mergeProps, splitProps } from "solid-js"

export const baseButtonTwClass = `rounded transition-all font-medium`
export interface ButtonAttributes
	extends JSX.ButtonHTMLAttributes<HTMLButtonElement> {
	children?: string | JSX.Element
	isIcon?: boolean
}

/**
 * @returns remove `class` from button props
 */
export function splitButtonProps(props: ButtonAttributes) {
	const [_, otherProps] = splitProps(props, ["class"])
	return mergeProps({ type: "button" as const }, otherProps)
}
