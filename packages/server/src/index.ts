import cors from "@elysiajs/cors"
import staticPlugin from "@elysiajs/static"
import swagger from "@elysiajs/swagger"
import { Elysia } from "elysia"
import { PostgresError } from "postgres"
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
  .onError(({ error, code }) => {
    if (code === "NOT_FOUND") return "Not Found :("
    console.log(error)
    if (error instanceof PostgresError) return "Database error :("
  })
  .get("/", () => "Hello Elysia")
  .use(user_router)
  .use(api_router)
  .listen(process.env.PORT || 3456)

console.log(
  `🦊 Elysia is running at http://${app.server?.hostname}:${app.server?.port}`,
)
