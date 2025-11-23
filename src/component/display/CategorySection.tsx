import type { Component, JSX } from "solid-js"
import { LinkButton } from "~/component/atomic/button"
import { ChevronRightIcon } from "solid-radix-icons"

type CategorySectionProps = {
	title: string
	viewAllHref: string
	children: JSX.Element
}

export const CategorySection: Component<CategorySectionProps> = (props) => {
	return (
		<section>
			<div class="mb-4 flex items-center justify-between">
				<h2 class="text-lg font-semibold text-slate-800">{props.title}</h2>
				<LinkButton variant="Tertiary" href={props.viewAllHref}>
					<div class="flex items-center text-sm">View All<ChevronRightIcon class="ml-1 size-4" /></div>
				</LinkButton>
			</div>
			{props.children}
		</section>
	)
}
