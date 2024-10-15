import { Elysia, t } from "elysia"
import { Session, User } from "~/database"

const COOKIE_OPTION = {
  secrets: ["Hakurei Reimu", "Kirisame Marisa"],
  path: "/" as const,
  httpOnly: true as const,
  sameSite: "lax" as const,
}

export const auth_service = new Elysia({ name: "Service.Auth" })
  .state({
    user: {} as User,
    session: {} as Session,
  })
  .model({
    "auth::sign": t.Object({
      username: t.RegExp(/^(?!.*[\p{C}\p{Z}])[\p{L}\p{N}\p{S}_]{1,16}$/u),
      password: t.String({ minLength: 8, maxLength: 64 }),
    }),
    "auth::session": t.Cookie(
      {
        session_token: t.String(),
      },
      {
        ...COOKIE_OPTION,
        sign: ["session_token"],
      },
    ),
    "auth::optional_session": t.Cookie(
      {
        session_token: t.Optional(t.String()),
      },
      {
        ...COOKIE_OPTION,
        sign: ["token"],
      },
    ),
  })
  .macro(({ onBeforeHandle }) => ({
    isSignIn(enabled: true) {
      if (!enabled) return
      onBeforeHandle(({ error, cookie, store: { user } }) => {
        if (!cookie.token.value) {
          return error(401, {
            success: false,
            message: "Unauthorized",
          })
        }

        const username = user.name

        if (!username) {
          return error(401, {
            success: false,
            message: "Unauthorized",
          })
        }
      })
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
