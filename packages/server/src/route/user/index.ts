import { myM } from "@touhouclouddb/utils"
import dayjs from "dayjs"
import { Micro as M } from "effect"
import { Elysia } from "elysia"
import { Session, User } from "~/database"
import { user } from "~/database/schema"
import { Response } from "~/lib/response"
import { UserModel } from "~/model/user"
import { SessionModel } from "~/model/user/session"
import { auth_service, user_info } from "~/service/user"

export const user_router = new Elysia()
  .use(auth_service)
  .post(
    "/sign-up",
    async ({ body: { username, password }, store, cookie: { token } }) => {
      let task = UserModel.existMicro(username).pipe(
        myM.flatMap((x) =>
          !x ?
            M.fail("User already exists" as const)
          : UserModel.insertMicro({ name: username, password }),
        ),
        M.bindTo("user"),
        myM.bind("session", SessionModel.createSessionMicro),
        M.tap(setStore),
        M.match({
          onSuccess: ({ user }) => Response.hello(user.name),
          onFailure: (err) => {
            if (err === "User already exists") return Response.err(409, err)
            else return Response.err(500, err)
          },
        }),
      )

      return M.runPromise(task)

      function setStore({ user, session }: { user: User; session: Session }) {
        return () => {
          store.user = user
          store.session = session
          token.set({
            value: session.id,
            maxAge: dayjs().add(30, "day").diff(dayjs(), "second"),
          })
        }
      }
    },
    {
      body: "auth::sign_in",
    },
  )
  .post(
    "/sign-in",
    async ({ store, body: { username, password }, cookie: { token } }) => {
      if (user.name) return Response.err(403, "Already signed in")
      let current_session = await SessionModel.validateToken({
        token: token.value,
      })
      if (!current_session) {
        let user = await UserModel.findByName(username)
        if (!user) return Response.err(404, "User not found")
        if (!(await Bun.password.verify(password, user.password))) {
          return Response.err(401, "Incorrect password")
        }
        store.user = user
        let new_token = SessionModel.generateSessionToken()
        store.session = await SessionModel.createSession(new_token, user.id)
        token.set({
          value: new_token,
          maxAge: dayjs().add(30, "day").diff(dayjs(), "second"),
        })
        return Response.hello(user.name)
      }
      return Response.err(409, "Already signed in")
    },
    {
      body: "auth::sign_in",
      cookie: "auth::optional_session",
    },
  )
  .use(user_info)
  .get(
    "/sign-out",
    async ({ cookie: { token } }) => {
      await SessionModel.invalidateSession(token.value)
      token.remove()

      return Response.ok("Signed out")
    },
    {
      cookie: "auth::optional_session",
    },
  )
  .get(
    "/profile",
    ({ store: { user } }) => {
      return Response.ok(user)
    },
    {
      isSignIn: true,
      cookie: "auth::optional_session",
    },
  )
