import { Elysia, t } from "elysia"
export const auth_service = new Elysia({ name: "Service.Auth" })
	.state({
		user: {} as Record<string, string>,
		session: {} as Record<number, string>,
	})
	.model({
		signIn: t.Object({
			username: t.String({ minLength: 1 }),
			password: t.String({ minLength: 8 }),
		}),
		session: t.Cookie(
			{
				token: t.Number(),
			},
			{
				secrets: "seia",
			}
		),
	})
	.model((model) => ({
		...model,
		optionalSession: t.Optional(model.session),
	}))
	.macro(({ onBeforeHandle }) => ({
		isSignIn(enabled: true) {
			if (!enabled) return

			onBeforeHandle(({ error, cookie: { token }, store: { session } }) => {
				if (!token.value)
					return error(401, {
						success: false,
						message: "Unauthorized",
					})

				const username = session[token.value as unknown as number]

				if (!username)
					return error(401, {
						success: false,
						message: "Unauthorized",
					})
			})
		},
	}))
