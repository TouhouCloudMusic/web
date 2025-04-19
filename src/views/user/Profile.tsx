import { Link } from "@tanstack/solid-router"
import {
	type ComponentProps,
	Match,
	mergeProps,
	Show,
	splitProps,
	Switch,
} from "solid-js"
import { type DOMElement } from "solid-js/jsx-runtime"
import { twMerge } from "tailwind-merge"
import { url } from "valibot"
import { Avatar } from "~/components/avatar"
import { Button } from "~/components/button"
import { PageLayout } from "~/components/layout/PageLayout"
import { Data } from "~/data"
import { type UserProfile } from "~/model/user"
import { imgUrl } from "~/utils/adapter/static_file"
import { callHandlerUnion } from "~/utils/dom/event"

type Props = {
	data: Data<UserProfile>
}

export function Profile(props: Props) {
	return (
		<PageLayout>
			{/* Background image */}
			<div class="flex aspect-[4.236] w-full overflow-hidden bg-slate-200">
				<Show when={props.data.value?.banner_url}>
					{(url) => (
						<img
							src={imgUrl(url())}
							class="size-full object-cover object-center"
							alt="Banner of the user profile"
						/>
					)}
				</Show>
			</div>

			<div class="bg-white px-8 pb-8">
				<div class="grid auto-rows-auto grid-cols-12 gap-4 px-4">
					{/* Avatar */}
					<div class="col-span-3 flex justify-center">
						<div class="relative h-24 w-48">
							<div class="absolute -top-25">
								<Avatar
									class="h-48 w-48 rounded-full border-3 border-white bg-slate-200"
									user={props.data.value}
								/>
							</div>
						</div>
					</div>
					<div class="col-span-full col-start-4 mb-4 flex h-fit rounded-xl px-2 py-4">
						<div class="flex">
							<span class="self-center font-inter text-xl font-semibold">
								<Show when={Data.isOk(props.data)}>
									{Data.unwrap(props.data).name}
								</Show>
							</span>
						</div>
						<FollowButton state={FollowButtonState.CurrentUser} />
					</div>
					<div class="col-span-3 min-h-[1024px] rounded-xl bg-slate-100 p-4">
						<h2 class="mb-2 font-bold text-slate-700">Intro</h2>
						<p class="text-sm text-slate-600">简介内容...</p>
					</div>
					<div class="col-span-9 rounded-xl bg-slate-100 p-4">
						<h2 class="mb-2 font-bold text-slate-700">Timeline</h2>
						<ul class="space-y-2 text-sm text-slate-600"></ul>
					</div>
				</div>
			</div>
		</PageLayout>
	)
}

const enum FollowButtonState {
	CurrentUser,
	Following,
	Unfollowed,
}
type FollowButtonProps = {
	state: FollowButtonState
} & ComponentProps<typeof Button>

function FollowButton(props: FollowButtonProps) {
	const CLASS = "ml-auto w-25 rounded-full font-inter"

	const [_, localProps] = splitProps(props, ["state"])

	const buttonProps = mergeProps(localProps, {
		get onMouseOver() {
			return props.state === FollowButtonState.Following ?
					(
						e: MouseEvent & {
							currentTarget: HTMLButtonElement
							target: DOMElement
						},
						// eslint-disable-next-line solid/reactivity
					) => {
						e.target.innerHTML = "Unfollow"
						callHandlerUnion(e, props.onMouseOver)
					}
				:	props.onMouseOver
		},
		get onMouseOut() {
			return props.state === FollowButtonState.Following ?
					(
						e: MouseEvent & {
							currentTarget: HTMLButtonElement
							target: DOMElement
						},
						// eslint-disable-next-line solid/reactivity
					) => {
						e.target.innerHTML = "Following"
						callHandlerUnion(e, props.onMouseEnter)
					}
				:	props.onMouseOver
		},
	} satisfies ComponentProps<"button">)

	return (
		<Switch>
			<Match when={props.state === FollowButtonState.CurrentUser}>
				<Button
					variant="Tertiary"
					color="Slate"
					class={twMerge(CLASS, "text-slate-600")}
					{...buttonProps}
				>
					<Link to="/profile/edit">Edit</Link>
				</Button>
			</Match>
			<Match when={props.state === FollowButtonState.Unfollowed}>
				<Button
					variant="Primary"
					color="Reimu"
					class={CLASS}
					{...buttonProps}
				>
					Follow
				</Button>
			</Match>
			<Match when={props.state === FollowButtonState.Following}>
				<Button
					variant="Secondary"
					color="Reimu"
					class={CLASS}
					{...buttonProps}
				>
					Followed
				</Button>
			</Match>
		</Switch>
	)
}
