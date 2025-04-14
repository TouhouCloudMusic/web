import { Link } from "@tanstack/solid-router"
import { ComponentProps, Match, Show, splitProps, Switch } from "solid-js"
import { Button } from "~/components/button"
import { PageLayout } from "~/components/layout/PageLayout"
import { Data } from "~/data"
import { type UserProfile } from "~/model/user"

type Props = {
	data: Data<UserProfile>
}

export function Profile(props: Props) {
	return (
		<PageLayout>
			{/* Background image */}
			<div class="flex h-56 w-full bg-slate-200">
				<p class="m-auto self-center text-center text-slate-600">bg image</p>
			</div>

			<div class="relative isolate bg-white px-8 pb-8">
				{/* Avatar */}
				<div class="absolute -top-21 left-20 z-10 flex items-center space-x-4">
					<div class="h-40 w-40 rounded-full border-2 border-white bg-slate-200"></div>
				</div>

				<div class="grid auto-rows-auto grid-cols-12 gap-4 px-4">
					<div class="col-span-full col-start-4 mb-4 flex h-fit rounded-xl px-2 py-4">
						<div class="flex">
							<span class="self-center font-inter text-xl font-semibold">
								<Show when={Data.isOk(props.data)}>
									{Data.unwrap(props.data).name}
								</Show>
							</span>
						</div>
						<FollowButton state={FoloBtnState.Following} />
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

const enum FoloBtnState {
	CurrentUser,
	Following,
	Unfollowed,
}
type FoloBtnProps = {
	state: FoloBtnState
} & ComponentProps<typeof Button>

function FollowButton(props: FoloBtnProps) {
	const [_, buttonProps] = splitProps(props, ["state"])
	return (
		<Switch>
			<Match when={props.state === FoloBtnState.Unfollowed}>
				<Button
					variant="Primary"
					color="Reimu"
					class="ml-auto"
					{...buttonProps}
				>
					Follow
				</Button>
			</Match>
			<Match when={props.state === FoloBtnState.Following}>
				<Button
					variant="Secondary"
					color="Reimu"
					class="ml-auto"
					{...buttonProps}
				>
					Followed
				</Button>
			</Match>
		</Switch>
	)
}

function EditBtn() {
	return (
		<div>
			<Link to="/profile/edit">
				<Button variant="Tertiary">编辑资料</Button>
			</Link>
		</div>
	)
}
