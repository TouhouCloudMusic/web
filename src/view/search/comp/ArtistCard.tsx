import type { SimpleArtist } from "@thc/api"
import type { Component } from "solid-js"
import type { LinkButtonProps } from "~/component/atomic/button"
import { LinkButton } from "~/component/atomic/button"

type ArtistCardProps = LinkButtonProps & {
	artist: SimpleArtist
}

export const ArtistCard: Component<ArtistCardProps> = (props) => {
	return (
		<LinkButton 
			{...props}
			variant={props.variant ?? "Tertiary"}
			href={props.href ?? `/artist/${props.artist.id}`}
			class="flex flex-col items-center gap-2 p-4 rounded-xl"
		>
			<img
				src="https://img.paulzzh.com/touhou/random"
				alt={props.artist.name}
				class="size-24 shrink-0 rounded-full bg-slate-200 object-cover"
			/>
			<span class="text-sm text-slate-700">{props.artist.name}</span>
		</LinkButton>
	)
}
