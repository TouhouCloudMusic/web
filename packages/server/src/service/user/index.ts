import dayjs from "dayjs"
import { Cookie, Elysia, error, t } from "elysia"
import { Session } from "~/database"
import { User, UserLinks } from "~/database/user/typebox"
import { SessionModel, SessionValidateResult } from "~/model/session"

const COOKIE_OPTION = {
  secrets: ["Hakurei Reimu", "Kirisame Marisa"],
  path: "/" as const,
  httpOnly: true as const,
  secure: import.meta.env.NODE_ENV === "production",
  sameSite: "lax" as const,
}

export const SESSION_TOKEN_NAME = "session_token"

export const auth_service = new Elysia({ name: "Service.Auth" })
  .state({
    user: undefined,
    session: undefined,
  } as {
    user: (User & UserLinks) | undefined
    session: Session | undefined
  })
  .model({
    "auth::sign": t.Object({
      username: t.RegExp(/^(?!.*[\p{C}\p{Z}])[\p{L}\p{N}\p{S}_]{1,32}$/u, {
        error: "Invalid username",
      }),
      password: t.String({ minLength: 8, maxLength: 64 }),
    }),
    "auth::session": t.Cookie(
      {
        [SESSION_TOKEN_NAME]: t.String(),
      },
      {
        ...COOKIE_OPTION,
        sign: [SESSION_TOKEN_NAME],
      },
    ),
    "auth::optional_session": t.Cookie(
      {
        [SESSION_TOKEN_NAME]: t.Optional(t.String()),
      },
      {
        ...COOKIE_OPTION,
        sign: [SESSION_TOKEN_NAME],
      },
    ),
  })
  .macro(({ onBeforeHandle, onError }) => ({
    isSignIn(enabled: true) {
      if (!enabled) return
      onBeforeHandle(async ({ error, cookie, store }) => {
        const token = cookie[SESSION_TOKEN_NAME].value
        if (!token) {
          return error(401)
        }

        const session_validate_result: SessionValidateResult | null =
          store.user && store.session ?
            (store as SessionValidateResult)
          : await SessionModel.validateToken(token)
        if (!session_validate_result) {
          return error(401)
        }

        updateSessionState({
          ...session_validate_result,
          store,
          session_token: cookie[SESSION_TOKEN_NAME],
        })
      })
      onError(({ cookie }) => {
        if (!cookie[SESSION_TOKEN_NAME].value) return error(401)
      })
    },
  }))

export const auth_guard = new Elysia()
  .use(auth_service)
  .guard({
    isSignIn: true,
    cookie: "auth::session",
  })
  .state((store) => ({
    user: store.user!,
    session: store.session!,
  }))
  .as("plugin")

export function updateSessionState<U, S>({
  user,
  session,
  store,
  session_token,
}: {
  user: U extends User ? U : never
  session: S extends Session ? S : never
  store: {
    user: unknown
    session: unknown
  }
  session_token: Cookie<string | undefined>
}) {
  store.user = user
  store.session = session
  session_token.set({
    value: (session as Session).id,
    maxAge: dayjs().add(30, "day").diff(dayjs(), "second"),
  })
}
