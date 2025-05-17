import { Dialog as K_Dialog } from "@kobalte/core"
import { Link, useLocation } from "@tanstack/solid-router"
import { createMemo, createResource, Match, Show, Switch } from "solid-js"
import { HamburgerMenuIcon, MagnifyingGlassIcon } from "solid-radix-icons"
import { type UserProfile } from "~/api/user"
import { Button } from "~/components/button"
import { NotificationState, useUserCtx } from "~/state/user"
import { createClickOutside } from "~/utils/solid/createClickOutside.ts"

import { Avatar } from "../avatar/index.tsx"
import { Dialog } from "../dialog"
import {
	BellAlertIcon,
	BellIcon,
	BellSlashIcon,
} from "../icons/heroicons/24/outline.tsx"
import { Input } from "../input"
import { RightSidebar } from "../sidebar/right"

const HEADER_BTN_CLASS = "size-6 p-1 m-auto"

export function Header() {
	const Divider = () => <span class="ml-3 h-5 w-[0.5px] bg-slate-400"></span>
	const location = useLocation();

	const navItems = [
		{ path: "/", label: "发现音乐" },
		{ path: "/library", label: "音乐库" },
		{ path: "/articles", label: "文章" },
		{ path: "/feeds", label: "动态" },
		{ path: "/profile", label: "个人中心" }
	];

	const isActive = (path: string) => {
		const pathname = location.pathname || "/";
		return pathname === path ||
			(path !== "/" && pathname && pathname.startsWith(path));
	};

	return (
		<header class="box-content content-center items-center border-b-1 border-slate-300 bg-primary px-4 py-2">
			<div class="my-auto flex h-12 items-center justify-between">
				{/* Left */}
				<div class="flex items-center">
					<Link to="/" class="mr-6 font-bold text-xl text-rose-600">东方同音鉴</Link>

					{/* 主导航 */}
					<nav class="flex items-center space-x-6">
						{navItems.map(item => (
							<Link
								to={item.path}
								class={`text-sm font-medium transition-colors ${isActive(item.path)
									? 'text-rose-600 relative'
									: 'text-gray-600 hover:text-gray-900'
									}`}
							>
								{item.label}
								{isActive(item.path) && (
									<div class="absolute -bottom-3 left-0 right-0 h-0.5 bg-rose-600 rounded-full"></div>
								)}
							</Link>
						))}
					</nav>
				</div>
				<SearchBar />

				{/* Right	*/}
				<div class="flex shrink place-content-center items-center gap-3">
					<Divider />
					<Show
						when={useUserCtx().user}
						fallback={<UnauthenticatedButtons />}
					>
						{(user) => <AuthenticatedContent user={user()} />}
					</Show>
				</div>
			</div>
		</header>
	)
}

function AuthenticatedContent(props: { user: UserProfile }) {
	let [show, setShow, setRef] = createClickOutside()
	let close = () => setShow(false)
	let [data] = createResource(() => Promise.resolve(props.user))
	return (
		<>
			<div class="grid h-8 w-8 place-items-center">
				<NotificationButton />
			</div>
			<button onClick={() => setShow(!show())}>
				<Avatar user={data} />
			</button>
			<Dialog.Root
				open={show()}
				onOpenChange={close}
			>
				<Dialog.Portal>
					<Dialog.Overlay onClick={close} />
					<K_Dialog.Content class="fixed inset-0 z-50">
						<RightSidebar
							ref={setRef}
							onClose={() => setShow(false)}
						/>
					</K_Dialog.Content>
				</Dialog.Portal>
			</Dialog.Root>
		</>
	)
}

function SearchBar() {
	return (
		<div class="grid items-center">
			<Input
				class={`mr-auto h-7 w-96 rounded-xs border-none bg-slate-100 pl-2 duration-200`}
			/>
			<MagnifyingGlassIcon class={"absolute col-start-1 ml-2 size-4"} />
		</div>
	)
}

function NotificationButton() {
	let notification_state = createMemo(() => useUserCtx().notification_state)
	return (
		<Button
			variant="Tertiary"
			class={HEADER_BTN_CLASS}
		>
			<Switch>
				<Match when={notification_state() === NotificationState.None}>
					<BellIcon class={"m-auto size-4"} />
				</Match>
				<Match when={notification_state() === NotificationState.Unread}>
					<BellAlertIcon class={"m-auto size-4"} />
				</Match>
				<Match when={notification_state() === NotificationState.Muted}>
					<BellSlashIcon class={"m-auto size-4"} />
				</Match>
			</Switch>
		</Button>
	)
}

function UnauthenticatedButtons() {
	// @tw
	const BTN_CLASS = "w-18 max-h-full text-sm"
	return (
		<>
			<Button
				variant="Tertiary"
				size="Sm"
				class={BTN_CLASS.concat(" ", "text-slate-900")}
			>
				<Link
					to="/auth"
					search={{
						type: "sign_in",
					}}
				>
					登录
				</Link>
			</Button>
			<Button
				variant="Primary"
				size="Sm"
				class={BTN_CLASS}
			>
				<Link
					to="/auth"
					search={{
						type: "sign_up",
					}}
				>
					注册
				</Link>
			</Button>
		</>
	)
}
