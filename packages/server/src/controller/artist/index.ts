import Elysia, { Static, t } from "elysia"
import { Schema } from "~/lib/schema"
import { auth_service } from "~/service/user"

const artist_schema = t.Object({
	id: Schema.id,
	name: Schema.name,
})

type Artist = Static<typeof artist_schema>

class ArtistController {
	private auto_incre = 1
	constructor(
		public data: Artist[] = [
			{
				id: this.auto_incre++,
				name: "foo",
			},
		]
	) {}

	add(artist: Omit<Artist, "id">) {
		this.data.push({
			id: this.auto_incre++,
			...artist,
		})
	}

	remove(index: number) {
		this.data.splice(index, 1)
	}

	update(index: number, artist: Omit<Artist, "id">) {
		this.data[index] = {
			id: this.data[index].id,
			...artist,
		}
	}
}

const body_validator = {
	body: t.Object({
		data: artist_schema,
	}),
}
export const artist_router = new Elysia({ prefix: "/artist" })
	.decorate("artist", new ArtistController())
	.use(auth_service)
	.onTransform(function log({ body, params, path, request: { method } }) {
		console.log(`${method} ${path}`, {
			body,
			params,
		})
	})
	.model({
		artist: t.Object({
			data: t.Omit(artist_schema, ["id"]),
		}),
		id: t.Object({
			id: Schema.id,
		}),
	})
	.get("/", ({ artist }) => artist.data)
	.post("/", ({ artist, body: { data } }) => artist.add(data), body_validator)
	.group("/:id", (router) =>
		router
			.guard({
				params: "id",
			})
			.get(
				"/",
				({ artist, params: { id }, error }) => artist.data[id - 1] ?? error(404)
			)
			.delete("/", ({ artist, params: { id }, error }) => {
				if (artist.data.findIndex((a) => a.id === id) !== undefined)
					return artist.remove(id - 1)
				else return error(422)
			})
			.post(
				"/",
				({ artist, params: { id }, body: { data }, error }) => {
					if (artist.data.findIndex((a) => a.id === id) !== undefined)
						return artist.update(id - 1, data)
					else return error(422)
				},
				{
					body: "artist",
				}
			)
	)
