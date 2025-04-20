import { type AccessorWithLatest } from "@solidjs/router"
import { Link } from "@tanstack/solid-router"
import {
	type ComponentProps,
	createContext,
	Match,
	mergeProps,
	Show,
	Suspense,
	Switch,
} from "solid-js"
import { type DOMElement } from "solid-js/jsx-runtime"
import { twJoin, twMerge } from "tailwind-merge"
import { Avatar } from "~/components/avatar"
import { Button } from "~/components/button"
import { PageLayout } from "~/components/layout/PageLayout"
import { type UserProfile } from "~/model/user"
import { imgUrl } from "~/utils/adapter/static_file"
import { assertContext } from "~/utils/context"
import { callHandlerUnion } from "~/utils/dom/event"

type Props = {
	data: AccessorWithLatest<UserProfile | undefined>
	isCurrentUser: boolean
}

type Context = {
	user: AccessorWithLatest<UserProfile | undefined>
	userType: UserType
}

const Context = createContext<Context>()

const enum UserType {
	Current,
	Following,
	Unfollowed,
}

export function Profile(props: Props) {
	const contextValue: Context = {
		get user() {
			return props.data
		},
		get userType() {
			if (props.isCurrentUser) {
				return UserType.Current
			} else if (this.user()?.is_following) {
				return UserType.Following
			} else {
				return UserType.Unfollowed
			}
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
					"flex h-68 w-full overflow-hidden bg-slate-200 not-has-[img]:animate-pulse",
				)}
			>
				<Suspense>
					<Show when={context.user()?.banner_url}>
						{(url) => (
							<img
								src={imgUrl(url())}
								class="size-full object-cover object-center"
								alt="Banner of the user profile"
							/>
						)}
					</Show>
				</Suspense>
			</div>

			<div class="bg-white px-8 pb-8">
				<div class="grid auto-rows-auto grid-cols-12 gap-4 px-4">
					{/* Avatar */}
					<ProfileAvatar />
					<div class="col-span-full col-start-4 mx-2 my-4 flex h-10 items-baseline rounded-xl">
						<UserName />
						<ProfileButton />
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

function UserName() {
	const context = assertContext(Context)
	return (
		<Suspense
			fallback={
				<div class="h-full w-36 animate-pulse rounded-md bg-slate-200"></div>
			}
		>
			<span class="flex font-inter text-xl font-semibold">
				{context.user()?.name}
			</span>
		</Suspense>
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
					user={context.user}
				/>
			</div>
		</div>
	)
}

type ProfileButtonProps = ComponentProps<typeof Button>

function ProfileButton(props: ProfileButtonProps) {
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
		<Suspense
			fallback={
				<div
					class={twMerge(
						CLASS,
						"h-full w-25 animate-pulse rounded-full bg-slate-200",
					)}
				>
					{/* TODO: Skeleton */}
				</div>
			}
		>
			{void context.user()}
			<Switch>
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
		</Suspense>
	)
}
