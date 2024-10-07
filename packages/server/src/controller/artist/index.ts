import Elysia, { t } from "elysia"
import { Response } from "~/lib/response"
import { Schema } from "~/lib/schema"
import { artist_model } from "~/model/artist"
import { error_model } from "~/model/error"
export const artist_router = new Elysia({ prefix: "/artist" })
	.use(error_model)
	.use(artist_model)
	// .get(
	// 	"",
	// 	async ({ artist, query: { keyword } }) => {
	// 		const result = await artist.findByKeyword(keyword)
	// 		if (!result || result.length === 0) {
	// 			return Response.notFound("Artist Not Found")
	// 		} else return Response.ok(result)
	// 	},
	// 	{
	// 		query: t.Object({
	// 			keyword: t.String(),
	// 		}),
	// 		response: {
	// 			200: "artist::find_by_keyword",
	// 			404: Schema.err,
	// 		},
	// 	}
	// )
	.post(
		"",
		async ({ artist, body }) => {
			return artist.insert(body)
		},
		{
			body: "artist::new",
		}
	)
	.group("/:id", (router) =>
		router
			.guard({
				params: t.Object({
					id: Schema.app_id,
				}),
			})
			.get(
				"",
				async ({ artist, params: { id } }) => {
					let res = await artist.findByID(id)
					return !res ? Response.notFound("Artist Not Found") : Response.ok(res)
				},
				{
					response: {
						200: "artist::find_by_id",
						404: "error",
					},
				}
			)
	)
