import type { SimpleArtist } from "@thc/api"
import type { Component } from "solid-js"
import type { LinkButtonProps } from "~/component/atomic/button"
import { LinkButton } from "~/component/atomic/button"
import { HighlightText } from "~/component/display/HighlightText"

type ArtistCardProps = LinkButtonProps & {
	artist: SimpleArtist
	keyword?: string
}

export const ArtistCard: Component<ArtistCardProps> = (props) => {
	return (
		<LinkButton 
			{...props}
			variant={props.variant ?? "Tertiary"}
			href={props.href ?? `/artist/${props.artist.id}`}
			class="flex flex-col items-center gap-2 py-4 px-5 rounded-xl"
		>
			<img
				src="https://img.paulzzh.com/touhou/random"
				alt={props.artist.name}
				class="size-36 shrink-0 rounded-full bg-slate-200 object-cover"
			/>
			<span class="text-sm text-slate-700">
				<HighlightText text={props.artist.name} keyword={props.keyword ?? ""} />
			</span>
		</LinkButton>
	)
}
