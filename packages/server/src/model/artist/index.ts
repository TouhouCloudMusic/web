import { Artist as A, artist, NewArtist as NA } from "db/schema"
import { artist_schema, new_artist_schema } from "db/type/typebox"
import Elysia from "elysia"
import { db as _db, DB } from "~/lib/db_client.js"
import { Schema } from "~/lib/schema"
import { Entity } from ".."

class Artist implements Partial<Entity<A, NA>> {
	private db: DB
	constructor(db?: DB) {
		this.db = db ?? _db
	}

	findByID(id: number) {
		return this.db.query.artist.findFirst({
			where: (fields, op) => op.eq(fields.id, id),
			with: {
				alias_group: true,
				localized_name: true,
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
	}

	insert(data: NA) {
		return this.db.insert(artist).values(data).returning()
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
	.decorate("artist", new Artist())
