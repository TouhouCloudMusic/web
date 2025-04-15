import { createSignal, type JSX, Show, splitProps } from "solid-js"
import { twMerge } from "tailwind-merge"
import { type UserProfile } from "~/model/user"

export interface Props
	extends Omit<JSX.ImgHTMLAttributes<HTMLImageElement>, "src" | "onError"> {
	user?: UserProfile | undefined
}

export function Avatar(props: Props) {
	let [error, set_error] = createSignal(false)

	let [_, other_props] = splitProps(props, ["class", "user"])

	return (
		<div class={twMerge("size-8 overflow-hidden rounded-full", props.class)}>
			<Show
				when={!error()}
				fallback={
					<div class="flex size-full items-center justify-center bg-slate-200">
						<span class="text-slate-500">
							{props.user?.name[0]?.toUpperCase() ?? "N/A"}
						</span>
					</div>
				}
			>
				<img
					{...other_props}
					src={props.user?.avatar_url ?? ""}
					alt={props.alt ?? "avatar"}
					onError={() => {
						set_error(true)
					}}
					class="size-full object-cover"
				/>
			</Show>
		</div>
	)
}
