import { UserApi, AuthApi } from "@thc/api"
import type { UserProfile } from "@thc/queryy"
import type { ParentProps } from "solid-js"
import { createContext, onMount } from "solid-js"
import { createMutable } from "solid-js/store"

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
		const result = await UserApi.profile()

		this.isLoading = false
		if (result.status === "Ok" && result.data) {
			this.ctx = {
				user: result.data,
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
		const result = await AuthApi.signout()
		if (result.status !== "Ok") {
			dbg("Sign out failed", result.error)

			throw result.error
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
