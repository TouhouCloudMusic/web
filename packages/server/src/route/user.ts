import { verify } from "@node-rs/argon2"
import { hash } from "@touhouclouddb/utils"
import { Effect, Either } from "effect"
import { UnknownException } from "effect/Cause"
import { Elysia, error, redirect, t } from "elysia"
import { Response } from "~/lib/response"
import { ResponseSchema } from "~/lib/response/schema"
import { ImageModel } from "~/model/image"
import { SessionModel } from "~/model/session"
import {
  AVATAR_EXTENSION_NAME,
  user_model,
  UserModel,
  validateAvatar,
} from "~/model/user"
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

        const { id } = yield* UserModel.insertM({
          name: username,
          password: hashed_password,
        })

        const user = (yield* UserModel.findByIdM(id))!
        const session = yield* SessionModel.createM(id)

        updateSessionState({
          user,
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
            if (err instanceof UnknownException)
              return Response.err(500, err.message)
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
      const profile = {
        ...user,
        avatar: user?.avatar?.filename ?? null,
      }
      return Response.ok(profile)
    },
    {
      response: "user::profile",
    },
  )
  .group("/avatar", {}, (group) =>
    group
      .get("", ({ store: { user } }) => {
        const filename = user.avatar?.filename
        if (filename) return redirect(`image/${filename}`)
        else return error(404)
      })
      .post(
        "",
        async ({
          store: {
            user,
            session: { user_id },
          },
          body,
        }) => {
          const validated_image = await validateAvatar(body.data)
          return Either.match(validated_image, {
            onLeft(left) {
              return Response.err(400, left)
            },
            async onRight(right) {
              const bytes = new Uint8Array(right)
              const image = await new ImageModel().upload(user_id, {
                bytes,
                extension_name: AVATAR_EXTENSION_NAME,
              })
              await UserModel.updateAvatar({
                user_id,
                image_id: image.id,
              })
              user.avatar = image
              user.avatar_id = image.id

              return Response.ok("OK")
            },
          })
        },
        {
          body: "user::avatar",
          response: {
            200: ResponseSchema.ok(t.String()),
            400: ResponseSchema.err,
          },
        },
      )
      .delete(
        "",
        async ({ store: { user } }) => {
          await UserModel.removeAvatar(user)

          user.avatar = null
          user.avatar_id = null
          return Response.ok("OK")
        },
        {
          response: ResponseSchema.ok(t.String()),
        },
      ),
  )
