import { createSignal, type JSX, Show, splitProps } from "solid-js"
import { twMerge } from "tailwind-merge"
import { type UserProfile } from "~/model/user"
import { imgUrl } from "~/utils/adapter/static_file"

export interface Props
	extends Omit<JSX.ImgHTMLAttributes<HTMLImageElement>, "src" | "onError"> {
	user?: UserProfile | undefined
}

export function Avatar(props: Props) {
	let [error, set_error] = createSignal(false)

	let [_, other_props] = splitProps(props, ["class", "user"])

	return (
		<Show
			when={!error()}
			fallback={
				<div
					class={twMerge(
						"flex size-8 items-center justify-center rounded-full bg-slate-200",
						props.class,
					)}
				>
					<span class="text-slate-500">
						{props.user?.name[0]?.toUpperCase() ?? "N/A"}
					</span>
				</div>
			}
		>
			<img
				{...other_props}
				src={imgUrl(props.user?.avatar_url) ?? ""}
				alt={props.alt ?? "avatar"}
				onError={() => {
					set_error(true)
				}}
				class={twMerge("size-8 rounded-full object-cover", props.class)}
			/>
		</Show>
	)
}
