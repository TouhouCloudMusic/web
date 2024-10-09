import dayjs from "dayjs"
import { Elysia } from "elysia"
import { user } from "~/database/schema"
import { Response } from "~/lib/response"
import { db } from "~/service/database"
import { auth_service, user_info } from "~/service/user"

export const user_router = new Elysia({ prefix: "/user" })
	.use(auth_service)
	.put(
		"/sign-up",
		async ({
			Session,
			body: { username, password },
			store,
			cookie: { token },
		}) => {
			let dupe = await db.query.user.findFirst({
				where: (fields, op) => op.eq(fields.name, username),
			})
			if (dupe) return Response.err(409, "User already exists")
			let new_user = (
				await db
					.insert(user)
					.values({
						name: username,
						password: await Bun.password.hash(password),
					})
					.returning()
			)[0]
			if (!new_user) return Response.err(500, "Sign Up Failed")
			store.user = new_user
			let new_token = Session.generateSessionToken()
			store.session = await Session.createSession(new_token, new_user.id)
			token.set({
				value: new_token,
				maxAge: dayjs().add(30, "day").diff(dayjs(), "second"),
			})
			return Response.ok(["Hello,", new_user.name].join(" "))
		},
		{
			body: "auth::sign_in",
		}
	)
	.post(
		"/sign-in",
		async ({
			Session,
			store,
			body: { username, password },
			cookie: { token },
		}) => {
			if (user.name) return Response.err(403, "Already signed in")
			let current_user = await Session.validateSessionToken(token.value)
			if (!current_user) {
				let user = await db.query.user.findFirst({
					where: (fields, op) => op.eq(fields.name, username),
				})
				if (!user) return Response.err(404, "User not found")
				if (!(await Bun.password.verify(password, user.password))) {
					return Response.err(401, "Incorrect password")
				}
				store.user = user
				let new_token = Session.generateSessionToken()
				store.session = await Session.createSession(new_token, user.id)
				token.set({
					value: new_token,
					maxAge: dayjs().add(30, "day").diff(dayjs(), "second"),
				})
				return Response.ok(["Hello,", user.name].join(" "))
			}
		},
		{
			body: "auth::sign_in",
			cookie: "auth::optional_session",
		}
	)
	.use(user_info)
	.get(
		"/sign-out",
		async ({ cookie: { token }, Session }) => {
			await Session.invalidateSession(token.value)
			token.remove()

			return Response.ok("Signed out")
		},
		{
			cookie: "auth::optional_session",
		}
	)
	.get(
		"/profile",
		({ store: { user } }) => {
			return Response.ok(user)
		},
		{
			isSignIn: true,
			cookie: "auth::session",
		}
	)
