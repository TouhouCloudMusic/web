import type { Component } from "solid-js"
import { Link } from "~/component/atomic/Link"
import type { LinkButtonProps } from "~/component/atomic/button"
import { LinkButton } from "~/component/atomic/button"
import { HighlightText } from "~/component/display/HighlightText"

type Playlist = {
	id: string
	title: string
	owner: { id: string; name: string }
}

type PlaylistCardProps = LinkButtonProps & {
	playlist: Playlist
	keyword?: string
}

export const PlaylistCard: Component<PlaylistCardProps> = (props) => {
	return (
		<LinkButton
			{...props}
			variant="Tertiary"
			class="text-left flex gap-3 p-2 rounded-xl"
		>
			<img
				src="https://img.paulzzh.com/touhou/random"
				alt={props.title}
				class="size-14 shrink-0 rounded-lg bg-slate-200 object-cover"
			/>
			<div class="flex min-w-0 flex-1 flex-col justify-center">
				<div class="truncate font-medium text-slate-800">
					<HighlightText text={props.playlist.title} keyword={props.keyword ?? ""} />
				</div>
				<Link class="!text-slate-700 text-sm mb-0.5" href={`/artist/${props.playlist.owner.id}`}>
					{props.playlist.owner.name}
				</Link>
				{props.children && (
					<div class="truncate text-xs">
						{props.children}
					</div>
				)}
			</div>
		</LinkButton>
	)
}
