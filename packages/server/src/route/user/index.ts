import { verify } from "@node-rs/argon2"
import { hash } from "@touhouclouddb/utils"
import dayjs from "dayjs"
import { Effect } from "effect"
import { Cookie, Elysia } from "elysia"
import { Session, User } from "~/database"
import { Response } from "~/lib/response"
import { UserModel } from "~/model/user"
import { SessionModel } from "~/model/user/session"
import { auth_service, user_info } from "~/service/user"

function updateSessionState({
  user,
  session,
  store,
  session_token,
}: {
  user: User
  session: Session
  store: {
    user: User
    session: Session
  }
  session_token: Cookie<string | undefined>
}) {
  store.user = user
  store.session = session
  session_token.set({
    value: session.id,
    maxAge: dayjs().add(30, "day").diff(dayjs(), "second"),
  })
}

export const user_router = new Elysia()
  .use(auth_service)
  .post(
    "/sign-up",
    async ({
      body: { username, password },
      store,
      cookie: { session_token },
    }) => {
      return Effect.gen(function* () {
        const exist = yield* UserModel.existM(username)

        yield* exist ?
          Effect.fail("User already exists" as const)
        : Effect.succeed(0)

        const hashed_password = yield* Effect.promise(() => hash(password))

        const user = yield* UserModel.insertM({
          name: username,
          password: hashed_password,
        })

        const session = yield* SessionModel.createSessionM(user)

        updateSessionState({ user, session, store, session_token })

        return user.name
      }).pipe(
        Effect.match({
          onSuccess: Response.hello,
          onFailure: (err) => {
            if (err === "User already exists") return Response.err(409, err)
            else return Response.err(500, err)
          },
        }),
        Effect.runPromise,
      )
    },
    {
      body: "auth::sign",
      cookie: "auth::optional_session",
    },
  )
  .post(
    "/sign-in",
    async ({
      store,
      body: { username, password },
      cookie: { session_token },
    }) => {
      if (store.user.name && session_token.value) {
        return Response.err(409, "Already signed in")
      }

      const check_session_by_token =
        session_token.value ?
          await SessionModel.validateToken({
            token: session_token.value,
          })
        : false
      if (check_session_by_token)
        return Response.hello(check_session_by_token.user.name)

      const result = await UserModel.findByNameWithSession(username)
      if (!result) return Response.err(404, "User not found")

      const { session, ...user } = result

      if (!(await verify(user.password, password))) {
        return Response.err(401, "Incorrect password")
      }

      let new_session: Session

      if (session) {
        new_session = session
      } else {
        new_session = await SessionModel.createSession(
          SessionModel.generateSessionToken(),
          user.id,
        )
      }

      updateSessionState({
        user,
        session: new_session,
        store,
        session_token,
      })

      session_token.set({
        value: new_session.id,
        maxAge: dayjs().add(30, "day").diff(dayjs(), "second"),
        sameSite: "lax",
        path: "/",
      })

      return Response.hello(user.name)
    },
    {
      body: "auth::sign",
      cookie: "auth::optional_session",
    },
  )
  .use(user_info)
  .get("/sign-out", async ({ cookie: { session_token } }) => {
    await SessionModel.invalidateSession(session_token.value)
    session_token.remove()

    return Response.ok("Signed out")
  })
  .get("/profile", ({ store: { user } }) => {
    return Response.ok(user)
  })
