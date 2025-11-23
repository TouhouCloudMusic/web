import type { LinkComponentProps } from "@tanstack/solid-router"
import { Link as RouterLink } from "@tanstack/solid-router"
import { twMerge } from "tailwind-merge"
import type { Component } from "solid-js"
import { For } from "solid-js"

const LINK_CLASS =
	"text-primary underline-offset-2 transition-colors hover:underline"

export type LinkProps = LinkComponentProps<"a">

export function Link(props: LinkProps) {
	const className = () => twMerge(props.class, LINK_CLASS)

	return (
		<RouterLink
			{...props}
			onClick={e => e.stopPropagation()}
			class={className()}
		/>
	)
}

type InlineLinksProps = LinkComponentProps<"a"> & {
	items: { text: string; link: string }[]
}

export const InlineLinks: Component<InlineLinksProps> = (props) => {
	const separatorClass = () => twMerge(props.class, "shrink-0 pr-1 pl-0.5")
	return (
		<div class="inline-flex min-w-0 text-xs">
			<For each={props.items}>
				{(item, index) => (
					<>
						<Link 
							class={props.class}
							href={item.link}
						>
							{item.text}
						</Link>
						{index() < props.items.length - 1 && (
							<span class={separatorClass()}>,</span>
						)}
					</> 
				)}
			</For>
		</div>
	)
}

