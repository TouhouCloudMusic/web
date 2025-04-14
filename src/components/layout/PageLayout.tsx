import { type ComponentProps, mergeProps, type ParentProps } from "solid-js"
import { twMerge } from "tailwind-merge"

export function PageLayout(props: ParentProps<ComponentProps<"div">>) {
	const CLASS = `
    bg-primary
    grid grid-cols-24
    h-full
    lg:max-w-[min(max(75%,1024px),1280px)]
    xl:max-w-3/4
    2xl:max-w-7xl
    mx-auto
    border-x-1 border-gray-300
    `
	let final_props = mergeProps(props, {
		get class() {
			return twMerge(CLASS, props.class)
		},
	})

	return (
		<div class="size-full bg-slate-100">
			<div {...final_props}></div>
		</div>
	)
}
