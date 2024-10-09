import Elysia, { t } from "elysia"
import { Response } from "~/lib/response"
import { Schema } from "~/lib/schema"
import { artist_model } from "~/model/artist"
import { error_model } from "~/model/error"
export const artist_controller = new Elysia({ prefix: "/artist" })
	.use(error_model)
	.use(artist_model)
	.get(
		"",
		async ({ artist, query: { keyword, limit } }) => {
			let result = await artist.findByKeyword(keyword, limit)
			if (result.length === 0) return Response.notFound("Artist Not Found")
			return Response.ok(result)
		},
		{
			query: t.Object({
				keyword: t
					.Transform(
						t.String({
							minLength: 1,
							maxLength: 100,
						})
					)
					.Decode((v) => v.trim())
					.Encode((v) => v.trim()),
				limit: t.Number(
					t.Integer({
						minimum: 1,
						maximum: 100,
						default: 10,
					})
				),
			}),
			response: {
				200: "artist::find_by_keyword",
				404: "error",
			},
		}
	)
	.post(
		"",
		async ({ artist, body }) => {
			return artist.insert(body)
		},
		{
			body: "artist::new",
		}
	)
	.group(
		"/:id",
		{
			params: t.Object({
				id: Schema.id,
			}),
		},
		($) =>
			$.get(
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
