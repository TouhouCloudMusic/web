import { Elysia, t } from "elysia"
import { Session, User } from "~/database"
import { SessionModel } from "./session"
export const auth_service = new Elysia({ name: "Service.Auth" })
	.decorate("Session", SessionModel)
	.state({
		user: {} as User,
		session: {} as Session,
	})
	.model({
		"auth::sign_in": t.Object({
			username: t.String({
				minLength: 1,
				maxLength: 16,
				pattern: "/^(?!.*[\\p{C}\\p{Z}])[\\p{L}\\p{N}\\p{S}_]+$/u",
			}),
			password: t.String({ minLength: 8, maxLength: 64 }),
		}),
		"auth::session": t.Cookie(
			{
				token: t.String({
					format: "uuid",
				}),
			},
			{
				secrets: "阿巴阿巴",
			}
		),
	})
	.model((model) => ({
		...model,
		"auth::optional_session": t.Optional(model["auth::session"]),
	}))
	.macro(({ onBeforeHandle }) => ({
		isSignIn(enabled: true) {
			if (!enabled) return

			onBeforeHandle(
				({ error, cookie: { token }, store: { session, user } }) => {
					if (!token.value)
						return error(401, {
							success: false,
							message: "Unauthorized",
						})

					const username = user.name

					if (!username)
						return error(401, {
							success: false,
							message: "Unauthorized",
						})
				}
			)
		},
	}))

export const user_info = new Elysia()
	.use(auth_service)
	.guard({
		isSignIn: true,
		cookie: "auth::session",
	})
	.resolve(({ store: { user } }) => ({
		username: user.name,
	}))
	.as("plugin")
