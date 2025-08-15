import type { ParentProps } from "solid-js"
import { createContext, onMount } from "solid-js"
import { createMutable } from "solid-js/store"

import type { UserProfile } from "~/api"
import { FetchClient } from "~/api"
import { dbg } from "~/utils/log"
import { assertContext } from "~/utils/solid/assertContext"

export const enum NotificationState {
	None,
	Unread,
	Muted,
}

export class UserStore {
	constructor(private ctx: UserContext) {
		createMutable(this)
	}

	private isLoading = false

	async trySignIn() {
		let res = await FetchClient.GET("/profile")

		this.isLoading = false
		if (res.data?.data) {
			this.ctx = {
				user: res.data.data,
			}
		}
	}

	get notification_state() {
		if (this.ctx?.config?.mute_notifications === true) {
			return NotificationState.Muted
		}
		if (this.ctx?.notifications?.length) {
			return NotificationState.Unread
		}
		return NotificationState.None
	}

	get user() {
		if (this.ctx) {
			return this.ctx.user
		}
	}

	get is_signed_in() {
		return this.user !== undefined
	}

	sign_in(ctx: UserContext) {
		this.ctx = ctx
	}

	async sign_out() {
		let res = await FetchClient.GET("/sign-out")
		if (!res.response.ok) {
			dbg("Sign out failed", res.error)

			throw res.error
		}
		this.ctx = undefined
	}
}

export type UserConfig = {
	mute_notifications: boolean
}

export type UserContext =
	| {
			user: UserProfile
			notifications?: unknown[]
			config?: UserConfig
	  }
	| undefined

const UserContext = createContext<UserStore>()

export const useCurrentUser = () => assertContext(UserContext, "UserContext")

export function UserContextProvider(props: ParentProps) {
	let store = new UserStore(undefined)
	onMount(() => {
		void store.trySignIn()
	})
	return (
		<UserContext.Provider value={store}>{props.children}</UserContext.Provider>
	)
}
