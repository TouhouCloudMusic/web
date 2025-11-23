import type { Component } from "solid-js"
import type { LinkButtonProps } from "~/component/atomic/button"
import { LinkButton } from "~/component/atomic/button"
import { HighlightText } from "~/component/display/HighlightText"


type User = {
	id: string
	name: string
	description?: string
}

type UserCardProps = LinkButtonProps & {
	user: User
	keyword?: string
}

export const UserCard: Component<UserCardProps> = (props) => {
	return (
		<LinkButton
			{...props}
			variant="Tertiary"
			class="text-left flex gap-3 p-2 rounded-xl"
		>
			<img
				src="https://img.paulzzh.com/touhou/random"
				alt={props.title}
				class="size-16 shrink-0 rounded-full bg-slate-200 object-cover"
			/>
			<div class="flex min-w-0 flex-1 flex-col justify-center">
				<div class="truncate font-medium text-slate-800">
					<HighlightText text={props.user.name} keyword={props.keyword ?? ""} />
				</div>
				<span class="text-sm text-slate-600">{props.user.description}</span>
			</div>
		</LinkButton>
	)
}
