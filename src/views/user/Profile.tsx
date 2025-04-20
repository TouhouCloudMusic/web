import { Link } from "@tanstack/solid-router"
import {
	type ComponentProps,
	createContext,
	createEffect,
	Match,
	mergeProps,
	Show,
	splitProps,
	Switch,
} from "solid-js"
import { type DOMElement } from "solid-js/jsx-runtime"
import { twJoin, twMerge } from "tailwind-merge"
import { Avatar } from "~/components/avatar"
import { Button } from "~/components/button"
import { PageLayout } from "~/components/layout/PageLayout"
import { Future, Result } from "~/libs/adt"
import { type UserProfile } from "~/model/user"
import { SafePick } from "~/types"
import { imgUrl } from "~/utils/adapter/static_file"
import { assertContext } from "~/utils/context"
import { callHandlerUnion } from "~/utils/dom/event"

type Props = {
	data: Future<Result<UserProfile>>
	isCurrentUser: boolean
}

type Context = {
	data: Props["data"]
	isReady(): this is {
		userResult: Result<UserProfile>
	}
	isOk?: () => this is {
		user: UserProfile
	}
	userResult: Result<UserProfile> | undefined
	user?: UserProfile | undefined
	userType: UserType
}

const Context = createContext<Context>()

const enum UserType {
	Current,
	Following,
	Unfollowed,
}

export function Profile(props: Props) {
	createEffect(() => {
		if (props.data.isReady() && props.data.output.isErr()) {
			throw props.data.output.error
		}
	})

	const contextValue: Context = {
		get data() {
			return props.data
		},
		get userType() {
			if (props.isCurrentUser) {
				return UserType.Current
			} else if (props.data.output?.value?.is_following) {
				return UserType.Following
			} else {
				return UserType.Unfollowed
			}
		},
		isReady: (): this is {
			userResult: Result<UserProfile>
		} => {
			return props.data.isReady()
		},
		isOk(): this is {
			user: UserProfile
		} {
			return props.data.output?.isOk() ?? false
		},
		get user() {
			return props.data.output?.value
		},
		get userResult() {
			return props.data.output
		},
	}

	return (
		<Context.Provider value={contextValue}>
			<Content />
		</Context.Provider>
	)
}

function Content() {
	const context = assertContext(Context)
	return (
		<PageLayout class="isolate">
			{/* Profile banner */}
			<div
				class={twJoin(
					"flex h-68 w-full overflow-hidden bg-slate-200",
					!context.data.isReady() && "animate-pulse",
				)}
			>
				<Show
					when={context.data.isReady() && context.data.output.value?.banner_url}
				>
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
					<ProfileAvatar />
					<div class="col-span-full col-start-4 flex h-fit rounded-xl px-2 py-4">
						<div class="flex">
							<span class="self-center font-inter text-xl font-semibold">
								<Show
									when={context.data.isReady() && context.data.output.isOk()}
								>
									{context.data.output!.unwrap().name}
								</Show>
							</span>
						</div>
						<RightButton />
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

function ProfileAvatar() {
	const context = assertContext(Context)

	return (
		<div class="z-10 col-span-3 -mt-[calc(40%+var(--avatar-border))] flex justify-center [--avatar-border:2px] md:[--avatar-border:3px] lg:[--avatar-border:4px]">
			{/* The height must be fit to ensure that the avatar is round */}
			<div class="flex aspect-square h-fit w-4/5 rounded-full bg-white">
				<Avatar
					class="m-auto size-[calc(100%-var(--avatar-border)*2)]"
					user={
						context.isReady() ? Future.Ready(context.user!) : Future.Pending()
					}
				/>
			</div>
		</div>
	)
}

type RightButton = ComponentProps<typeof Button>

function RightButton(props: RightButton) {
	const CLASS = "ml-auto w-25 rounded-full font-inter"

	const context = assertContext(Context)

	const buttonProps = mergeProps(props, {
		get onMouseOver() {
			return context.userType === UserType.Following ?
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
			return context.userType === UserType.Following ?
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
			<Match when={context.data.isPending()}>
				{/* TODO: Skeletons */}
				<div
					class={twMerge(
						CLASS,
						"h-9 w-25 animate-pulse rounded-full bg-slate-300",
					)}
				></div>
			</Match>
			<Match when={context.userType === UserType.Current}>
				<Button
					variant="Tertiary"
					color="Slate"
					class={twMerge(CLASS, "text-slate-600")}
					{...buttonProps}
				>
					<Link to="/profile/edit">Edit</Link>
				</Button>
			</Match>
			<Match when={context.userType === UserType.Unfollowed}>
				<Button
					variant="Primary"
					color="Reimu"
					class={CLASS}
					{...buttonProps}
				>
					Follow
				</Button>
			</Match>
			<Match when={context.userType === UserType.Following}>
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
