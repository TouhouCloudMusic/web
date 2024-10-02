import { opentelemetry } from "@elysiajs/opentelemetry"
import swagger from "@elysiajs/swagger"
import createClient from "edgedb"
import { Elysia } from "elysia"
import { artist_router } from "./controller/artist/index.js"
import { user_router } from "./controller/user"

const app = new Elysia()
	.use(opentelemetry())
	.use(swagger())
	.onError(({ error, code }) => {
		if (code === "NOT_FOUND") return "Not Found :("

		console.error(error)
	})
	.get("/", () => "Hello Elysia")
	.use(user_router)
	.use(artist_router)
	.listen(11451)

console.log(
	`🦊 Elysia is running at http://${app.server?.hostname}:${app.server?.port}`
)
