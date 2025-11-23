import type { Release } from "@thc/api"
import type { Component } from "solid-js"
import { Link } from "~/component/atomic"
import type { LinkButtonProps } from "~/component/atomic/button"
import { LinkButton } from "~/component/atomic/button"
import { HighlightText } from "~/component/display/HighlightText"

type ReleaseCardProps = LinkButtonProps & {
	release: Release
	keyword?: string
}

export const ReleaseCard: Component<ReleaseCardProps> = (props) => {
	return (
		<LinkButton 
			{...props}
			variant={props.variant ?? "Tertiary"}
			href={props.href ?? `/release/${props.release.id}`}
			class="flex flex-col items-start gap-2 p-2 rounded-2xl"
		>
			<img
				src="https://img.paulzzh.com/touhou/random"
				alt={props.release.title}
				class="size-42 shrink-0 rounded-xl bg-slate-200 object-cover"
			/>
			<div class="w-full text-sm px-1 flex flex-col mb-1">
				<span class="font-medium">
					<HighlightText text={props.release.title} keyword={props.keyword ?? ""} />
				</span>
				<div class="flex">
					<Link class="truncate text-xs !text-slate-600" href={`/artist/${props.release.artists?.[0]?.id ?? ''}`}>
						{props.release.artists?.[0]?.name ?? "No Artist"}
					</Link>
					<span class="text-xs text-slate-600 ml-1">
						 • {props.release.release_date ? `${new Date(props.release.release_date.value).getFullYear()}` : "n.d."}
					</span>
				</div>
			</div>
		</LinkButton>
	)
}
