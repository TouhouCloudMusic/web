import cors from "@elysiajs/cors"
import { opentelemetry } from "@elysiajs/opentelemetry"
import swagger from "@elysiajs/swagger"
import createClient from "edgedb"
import { Elysia } from "elysia"
import { artist_controller } from "./controller/artist/index.js"
import { user_router } from "./controller/user"

const app = new Elysia()
	.use(opentelemetry())
	.use(
		swagger({
			path: "/docs",
		})
	)
	.use(
		cors({
			origin: false,
		})
	)
	.onError(({ error, code }) => {
		if (code === "NOT_FOUND") return "Not Found :("

		console.error(error)
	})
	.get("/", () => "Hello Elysia")
	.use(user_router)
	.use(artist_controller)
	.listen(process.env.PORT || 3456)

console.log(
	`🦊 Elysia is running at http://${app.server?.hostname}:${app.server?.port}`
)
