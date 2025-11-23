import type { SimpleArtist } from "@thc/api"
import type { Component, JSX } from "solid-js"
import { InlineLinks } from "~/view/search/comp/InlineLinks"
import type { LinkButtonProps } from "~/component/atomic/button"
import { LinkButton } from "~/component/atomic/button"

type SongCardProps = LinkButtonProps & {
	title: string
	artists: SimpleArtist[]
	children?: JSX.Element
}

export const SongCard: Component<SongCardProps> = (props) => {
	return (
		<LinkButton
			{...props}
			variant="Tertiary"
			class="text-left flex gap-3 p-2 rounded-xl"
		>
			<img
				src="https://img.paulzzh.com/touhou/random"
				alt={props.title}
				class="size-16 shrink-0 rounded-lg bg-slate-200 object-cover"
			/>
			<div class="flex min-w-0 flex-1 flex-col justify-center gap-1">
				<div class="truncate text-sm font-medium text-slate-800">
					{props.title}
				</div>
				<InlineLinks items={props.artists.map(artist => ({ text: artist.name, link: `/artist/${artist.id}` }))} />
				{props.children && (
					<div class="truncate text-xs">
						{props.children}
					</div>
				)}
			</div>
		</LinkButton>
	)
}
