import cors from "@elysiajs/cors"
import { opentelemetry } from "@elysiajs/opentelemetry"
import swagger from "@elysiajs/swagger"
import createClient from "edgedb"
import { Elysia } from "elysia"
import { artist_controller } from "./controller/artist/index.js"
import { user_controller } from "./controller/user"

const app = new Elysia()
	.use(opentelemetry())
	.use(
		swagger({
			path: "/docs",
			documentation: {
				info: {
					title: "Touhou Cloud DB",
					version: "0.1.0",
				},
			},
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
	.use(user_controller)
	.use(artist_controller)
	.listen(process.env.PORT || 3456)

console.log(
	`🦊 Elysia is running at http://${app.server?.hostname}:${app.server?.port}`
)
