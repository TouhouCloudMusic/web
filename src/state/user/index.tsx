import { createContext, onMount, type ParentProps } from "solid-js"
import { createMutable } from "solid-js/store"

import { FetchClient, type UserProfile } from "~/api"
import { assertContext } from "~/utils/solid/assertContext"

export const enum NotificationState {
	None,
	Unread,
	Muted,
}

export class UserStore {
	constructor(private ctx: UserContext) {
		return createMutable(this)
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
		if ((this.ctx?.notifications?.length ?? 0) > 0) {
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
		let res = await FetchClient.GET("/sign_out")
		if (res.response.status != 200) {
			console.log("Sign out failed", res.error)

			throw res.error
		}
		this.ctx = undefined
	}
}

export type UserContext =
	| {
			user: UserProfile
			notifications?: unknown[]
			config?: UserConfig
	  }
	| undefined

export type UserConfig = {
	mute_notifications: boolean
}

const USER_CONTEXT = createContext<UserStore>()

export const useUserCtx = () => assertContext(USER_CONTEXT)

export function UserContextProvider(props: ParentProps) {
	let store = new UserStore(undefined)
	onMount(() => {
		void store.trySignIn()
	})
	return (
		<USER_CONTEXT.Provider value={store}>
			{props.children}
		</USER_CONTEXT.Provider>
	)
}
