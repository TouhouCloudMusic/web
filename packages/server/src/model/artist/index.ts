import { artist, artist_localized_name } from "db/schema"
import {
	Artist,
	artist_schema,
	new_artist_schema,
	NewArtist,
} from "db/type/typebox"
import Elysia from "elysia"
import { Schema } from "~/lib/schema"
import { db as _db, DB } from "~/service/database"
import { type Entity } from ".."

class ArtistModel implements Partial<Entity<Artist, NewArtist>> {
	private db: DB
	constructor(db?: DB) {
		this.db = db ?? _db
	}

	async findByID(id: number) {
		let res = await this.db.query.artist.findFirst({
			where: (fields, op) => op.eq(fields.id, id),
			with: {
				alias_group: true,
				localized_name: {
					columns: {
						language: true,
						name: true,
					},
				},
				members: {
					with: {
						member: true,
					},
				},
				member_of: {
					with: {
						group: true,
					},
				},
				release: true,
			},
		})

		return res
	}

	async insert(data: NewArtist) {
		let res = (await this.db.insert(artist).values(data).returning())[0]

		if (data.localized_name) {
			await this.db.insert(artist_localized_name).values(
				data.localized_name.map(({ name, language }) => ({
					name,
					language,
					artist_id: res.id,
				}))
			)
		}

		return (await this.findByID(res.id))!
	}

	// async findByKeyword(keyword: string, client?: DB) {
	// 	client = client ?? createClient()
	// 	return (await client.query(
	// 		`# edgeql
	// 		WITH
	// 		  keyword := <str>$keyword
	// 		SELECT Artist {
	// 			**,
	// 		}
	// 		FILTER
	// 		  .name ILIKE '%' ++ keyword ++ '%'
	// 		OR
	// 		  .localized_name.name ILIKE '%' ++ keyword ++ '%'
	// 		`,
	// 		{
	// 			keyword: keyword,
	// 		}
	// 	)) as ArtistResult[]
	// }
}

export const artist_model = new Elysia()
	.model({
		"artist::find_by_id": Schema.ok(artist_schema),
		"artist::new": new_artist_schema,
		// "artist::find_by_keyword": Schema.ok(t.Array(artist_schema)),
	})
	.decorate("artist", new ArtistModel())
