import cors from "@elysiajs/cors"
import staticPlugin from "@elysiajs/static"
import swagger from "@elysiajs/swagger"
import { Elysia, error } from "elysia"
import Postgres from "postgres"
import { Response } from "./lib/response"
import { api_router } from "./route"
import { user_router } from "./route/user"

const app = new Elysia()
  .use(
    staticPlugin({
      prefix: "/",
      staticLimit: 0,
    }),
  )
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
  .get("/", () => "Hello Elysia")
  .use(user_router)
  .use(api_router)
  .listen(process.env.PORT || 3456)

console.log(
  `🦊 Elysia is running at http://${app.server?.hostname}:${app.server?.port}`,
)
