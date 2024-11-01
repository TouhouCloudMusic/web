import cors from "@elysiajs/cors"
import { html } from "@elysiajs/html"
import staticPlugin from "@elysiajs/static"
import swagger from "@elysiajs/swagger"
import { Elysia, error } from "elysia"
import Postgres from "postgres"
import { Hello } from "./homepage"
import { Response } from "./lib/response"
import { api_router } from "./route"
import { database_service } from "./service/database"
import { user_controller } from "./user/controller"

export const app = new Elysia()
  .use(
    staticPlugin({
      prefix: "/",
      staticLimit: 0,
    }),
  )
  .use(html())
  .use(
    swagger({
      path: "/docs",
      provider: "swagger-ui",
      documentation: {
        info: {
          title: "Touhou Cloud DB",
          version: "0.1.0",
        },
      },
    }),
  )
  .use(
    cors({
      origin: false,
    }),
  )
  .onError(({ error: err, code }) => {
    if (code === "NOT_FOUND") return error(404)
    console.log(err)
    if (err instanceof Postgres.PostgresError)
      return Response.err(500, "Database error :(")
  })
  .use(Hello)
  .use(database_service())
  .use(user_controller)
  .use(api_router)
  .listen(process.env.PORT || 3456)

console.log(
  `🦊 Elysia is running at http://${app.server?.hostname}:${app.server?.port}`,
)
