import { verify } from "@node-rs/argon2"
import { Value } from "@sinclair/typebox/value"
import { hash } from "@touhouclouddb/utils"
import { Effect } from "effect"
import { UnknownException } from "effect/Cause"
import { Elysia, t } from "elysia"
import { user_schema } from "~/database/user/typebox"
import { Response } from "~/lib/response"
import { ResponseSchema } from "~/lib/response/schema"
import { ImageModel } from "~/model/image"
import { SessionModel } from "~/model/session"
import { user_model, UserModel } from "~/model/user"
import { auth_guard, auth_service, updateSessionState } from "~/service/user"

const AUTH_FAILED_MSG = "Incorrect username or password" as const
const ALREADY_SIGNED_IN = "Already signed in" as const
const ALREADY_SIGNED_IN_RESPONSE = Response.err(409, ALREADY_SIGNED_IN)
export const user_router = new Elysia()
  .use(auth_service)
  .use(user_model)
  .post(
    "/sign-up",
    async ({
      body: { username, password },
      store,
      cookie: { session_token: token },
    }) => {
      if (token.value) return ALREADY_SIGNED_IN_RESPONSE

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
          session_token: token,
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
      response: {
        200: ResponseSchema.ok(t.String()),
        409: ResponseSchema.err,
        500: ResponseSchema.err,
      },
      cookie: "auth::optional_session",
    },
  )
  .post(
    "/sign-in",
    async ({
      store,
      body: { username, password },
      cookie: { session_token: token },
    }) => {
      if (token.value) return ALREADY_SIGNED_IN_RESPONSE

      return Effect.gen(function* () {
        const validated_token =
          token.value ?
            yield* SessionModel.validateTokenM({
              token: token.value,
            })
          : null
        if (validated_token) return validated_token

        const { session, user } = yield* UserModel.findByNameWithSessionM(
          username,
        ).pipe(
          Effect.flatMap((result) =>
            result ? Effect.succeed(result) : Effect.fail(AUTH_FAILED_MSG),
          ),
          Effect.map(({ session, ...user }) => ({ session, user })),
        )

        yield* Effect.tryPromise(() => verify(user.password, password)).pipe(
          Effect.flatMap((x) =>
            x ? Effect.succeed(0) : Effect.fail(AUTH_FAILED_MSG),
          ),
        )

        const new_session = session ?? (yield* SessionModel.createM(user.id))

        return { user, session: new_session }
      }).pipe(
        Effect.match({
          onSuccess: ({ user, session }) => {
            updateSessionState({
              user,
              session,
              store,
              session_token: token,
            })
            return Response.hello(user.name)
          },
          onFailure: (err) => {
            switch (err) {
              case AUTH_FAILED_MSG:
                return Response.err(401, err)
              case "Update session failed":
              case "Delete session failed":
                return Response.internalServerError(err)
              default:
                if (err instanceof UnknownException)
                  return Response.internalServerError(err.message)
                else
                  return Response.internalServerError(
                    `${err[0]}\n${err[1].message}`,
                  )
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
      response: ResponseSchema.ok(user_schema),
    },
  )
  .post(
    "/avatar",
    async ({
      store: {
        session: { user_id },
      },
      body,
    }) => {
      const image_id = await new ImageModel().upload(user_id, body)
      await UserModel.updateAvatar({
        user_id,
        image_id,
      })
      return Response.ok("OK")
    },
    {
      body: "user::avatar",
      response: ResponseSchema.ok(t.String()),
    },
  )
