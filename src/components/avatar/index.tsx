import { setResponse } from "@modular-forms/solid"
import {
	createEffect,
	createSignal,
	type JSX,
	Match,
	Show,
	splitProps,
	Switch,
} from "solid-js"
import { twMerge } from "tailwind-merge"
import { Future, FutureResult, FutureState } from "~/libs/adt"
import { type UserProfile } from "~/model/user"
import { imgUrl } from "~/utils/adapter/static_file"

export interface Props
	extends Omit<JSX.ImgHTMLAttributes<HTMLImageElement>, "src" | "onError"> {
	user?: Future<UserProfile>
}

const enum ImageLoadingState {
	Loaded,
	Pending,
	Err,
}

export function Avatar(props: Props) {
	const [imageState, setImageState] = createSignal(ImageLoadingState.Pending)

	const [_, otherProps] = splitProps(props, ["class", "user"])

	return (
		<Switch>
			<Match when={props.user === undefined}>
				<div
					class={twMerge(
						"flex size-8 items-center justify-center rounded-full bg-slate-200",
						props.class,
					)}
				>
					<span class="text-slate-500">
						{props.user?.output?.name[0]?.toUpperCase() ?? "N/A"}
					</span>
				</div>
			</Match>
			<Match when={props.user?.isPending()}>
				<div
					class={twMerge(
						"size-8 animate-pulse items-center justify-center rounded-full bg-slate-200",
						props.class,
					)}
				></div>
			</Match>
			<Match when={props.user?.isReady() && props.user.output}>
				{(user) => (
					<img
						{...otherProps}
						src={imgUrl(user().avatar_url) ?? ""}
						alt={props.alt ?? "avatar"}
						onLoad={() => {
							setImageState(ImageLoadingState.Loaded)
						}}
						onError={() => {
							setImageState(ImageLoadingState.Err)
						}}
						class={twMerge(
							"size-8 rounded-full object-cover",
							imageState() === ImageLoadingState.Pending && "animate-pulse",
							props.class,
						)}
					/>
				)}
			</Match>
		</Switch>
	)
}
