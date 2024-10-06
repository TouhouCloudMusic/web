import createClient, { Client } from "edgedb"
import Elysia, { t } from "elysia"
import { Response } from "~/lib/response"
import { Schema } from "~/lib/schema"
import { artist_model, ArtistResult } from "~/model/artist"

class Artist {
	constructor() {}

	async findByID(id: number, client?: Client) {
		client = client ?? createClient()
		return (await client.querySingle(
			`# edgeql
			SELECT Artist {
				**
			} FILTER .app_id = <int64>$id;
			`,
			{
				id: id,
			}
		)) as ArtistResult
	}

	async findByKeyword(keyword: string, client?: Client) {
		client = client ?? createClient()
		return (await client.query(
			`# edgeql
			WITH
 			  keyword := <str>$keyword
			SELECT Artist {
				**,
			}
			FILTER
			  .name ILIKE '%' ++ keyword ++ '%'
			OR
			  .localized_name.name ILIKE '%' ++ keyword ++ '%'
			`,
			{
				keyword: keyword,
			}
		)) as ArtistResult[]
	}
}

export const artist_router = new Elysia({ prefix: "/artist" })
	.use(artist_model)
	.decorate("artist", new Artist())
	.get(
		"",
		async ({ artist, query: { keyword } }) => {
			const result = await artist.findByKeyword(keyword)
			if (!result || result.length === 0) {
				return Response.notFound("Artist Not Found")
			} else return Response.ok(result)
		},
		{
			query: t.Object({
				keyword: t.String(),
			}),
			response: {
				200: "artist::find_by_keyword",
				404: Schema.err,
			},
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

					if (res != null) return Response.ok(res)
					else return Response.notFound("Artist not found")
				},
				{
					response: {
						200: "artist::find_by_id",
						404: Schema.err,
					},
				}
			)
	)
