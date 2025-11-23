import type { SimpleArtist } from "@thc/api"
import type { Component, JSX } from "solid-js"
import { InlineLinks } from "~/component/atomic/Link"
import type { LinkButtonProps } from "~/component/atomic/button"
import { LinkButton } from "~/component/atomic/button"
import { HighlightText } from "~/component/display/HighlightText"

type SongCardProps = LinkButtonProps & {
	title: string
	artists: SimpleArtist[]
	children?: JSX.Element
	keyword?: string
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
			<div class="flex min-w-0 flex-1 flex-col justify-between">
				<div class="truncate font-medium text-slate-800">
					<HighlightText text={props.title} keyword={props.keyword ?? ""} />
				</div>
				<InlineLinks class="!text-slate-700 mb-0.5" items={props.artists.map(artist => ({ text: artist.name, link: `/artist/${artist.id}` }))} />
				{props.children && (
					<div class="truncate text-xs">
						{props.children}
					</div>
				)}
			</div>
		</LinkButton>
	)
}
