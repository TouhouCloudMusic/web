import { verify } from "@node-rs/argon2"
import { Value } from "@sinclair/typebox/value"
import { hash } from "@touhouclouddb/utils"
import { Effect } from "effect"
import { UnknownException } from "effect/Cause"
import { Elysia } from "elysia"
import { user_schema } from "~/database/user/typebox"
import { Response } from "~/lib/response"
import { Schema } from "~/lib/schema"
import { SessionModel } from "~/model/session"
import { UserModel } from "~/model/user"
import { auth_guard, auth_service, updateSessionState } from "~/service/user"

const AUTH_FAILED_MSG = "Incorrect username or password" as const
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

        const session = yield* SessionModel.createM(user.id)

        updateSessionState({
          user: Value.Clean(user_schema, user),
          session,
          store,
          session_token,
        })

        return user.name
      }).pipe(
        Effect.match({
          onSuccess: Response.hello,
          onFailure: (err) => {
            if (err === "User already exists") return Response.err(409, err)
            else return Response.err(500, `${err[0]}\n${err[1]}`)
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
      if (store.user?.name && session_token.value) {
        return Response.err(409, "Already signed in")
      }

      return Effect.gen(function* () {
        const checked_session_by_token =
          session_token.value ?
            yield* SessionModel.validateTokenM({
              token: session_token.value,
            })
          : null
        if (checked_session_by_token) return checked_session_by_token

        const user_with_session =
          yield* UserModel.findByNameWithSessionM(username)
        if (!user_with_session) yield* Effect.fail(AUTH_FAILED_MSG)

        const { session, ...user } = user_with_session!
        const right_pwd = yield* Effect.tryPromise(() =>
          verify(user.password, password),
        )
        if (!right_pwd) yield* Effect.fail(AUTH_FAILED_MSG)

        const new_session = session ?? (yield* SessionModel.createM(user.id))

        return { user, session: new_session }
      }).pipe(
        Effect.match({
          onSuccess: ({ user, session }) => {
            updateSessionState({
              user,
              session,
              store,
              session_token,
            })
            return Response.hello(user.name)
          },
          onFailure: (err) => {
            switch (err) {
              case AUTH_FAILED_MSG:
                return Response.err(401, err)
              case "Update session failed":
              case "Delete session failed":
                return Response.err(500, err)
              default:
                if (err instanceof UnknownException) {
                  return Response.err(500, err.message)
                }
                return Response.err(500, `${err[0]}\n${err[1].message}`)
            }
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
  .use(auth_guard)
  .get("/sign-out", async ({ cookie: { session_token } }) => {
    try {
      await SessionModel.invalidate(session_token.value)
    } catch (error) {
      return Response.err(500, error)
    }
    session_token.remove()

    return Response.ok("Signed out")
  })
  .get(
    "/profile",
    ({ store: { user } }) => {
      return Response.ok(user)
    },
    {
      response: Schema.ok(user_schema),
    },
  )
