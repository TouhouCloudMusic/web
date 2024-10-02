import createClient, { Client } from "edgedb"
import Elysia, { error, t } from "elysia"
import { Result } from "~/lib/result"
import { Schema } from "~/lib/schema"
import {
	artist_model,
	artist_result_schema,
	ArtistResult,
} from "~/model/artist"

class ArtistController {
	constructor() {}

	// add(artist: Omit<ArtistData, "id">) {
	// 	this.data.push({
	// 		app_id: this.auto_incre++,
	// 		...artist,
	// 	})
	// }

	async findByID(id: number, client?: Client) {
		client = client ?? createClient()
		return (await client.querySingle(
			`# edgeql
			SELECT Artist {
				**
			} FILTER .app_id = ${id};
			`
		)) as ArtistResult
	}

	// remove(index: number) {
	// 	this.data.splice(index, 1)
	// }

	// update(index: number, artist: Omit<ArtistData, "id">) {
	// 	this.data[index] = {
	// 		app_id: this.data[index].app_id,
	// 		...artist,
	// 	}
	// }
}

export const artist_router = new Elysia({ prefix: "/artist" })

	// .use(artist_model)
	.decorate("controller", new ArtistController())
	.onTransform(({ body, params, path, request: { method } }) => {
		console.log(`${method} ${path}`, {
			body,
			params,
		})
	})
	// .get("/", ({ controller }) => controller.data)
	// .post("/", ({ controller, body: { data } }) => controller.add(data), {
	// 	body: "artist",
	// })
	.group(
		"/:id",
		(router) =>
			router
				.guard({
					params: t.Object({
						id: Schema.app_id,
					}),
				})
				.get(
					"",
					async ({ controller, params: { id } }) => {
						let res = await controller.findByID(id)
						if (res != null) return Result.ok(res)
						else return Result.err(404, "Artist not found")
					},
					{
						response: {
							200: Schema.ok(artist_result_schema),
							404: Schema.err,
						},
					}
				)
		// .delete("", ({ controller, params: { id }, error }) => {
		// 	if (controller.data.findIndex((a) => a.app_id === id) !== undefined)
		// 		return controller.remove(id - 1)
		// 	else return error(422)
		// })
		// .post(
		// 	"",
		// 	({ controller, params: { id }, body: { data }, error }) => {
		// 		if (controller.data.findIndex((a) => a.app_id === id) !== undefined)
		// 			return controller.update(id - 1, data)
		// 		else return error(422)
		// 	},
		// 	{
		// 		body: "artist",
		// 	}
		// )
	)
