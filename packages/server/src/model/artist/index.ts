import { artist, artist_localized_name } from "db/schema"
import {
	Artist,
	artist_schema,
	new_artist_schema,
	NewArtist,
} from "db/type/typebox"
import Elysia, { t } from "elysia"
import { Schema } from "~/lib/schema"
import { db as _db, DB } from "~/service/database"
import { type Entity } from ".."

const result_shape = {
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
} as const

class ArtistModel implements Partial<Entity<Artist, NewArtist>> {
	private db: DB
	constructor(db?: DB) {
		this.db = db ?? _db
	}

	async findByID(id: number) {
		let res = await this.db.query.artist.findFirst({
			where: (fields, op) => op.eq(fields.id, id),
			with: result_shape,
		})

		return res
	}

	async insert(data: NewArtist) {
		return this.db
			.transaction(async (tx) => {
				let res = (await tx.insert(artist).values(data).returning())[0]

				if (data.localized_name) {
					await tx.insert(artist_localized_name).values(
						data.localized_name.map(({ name, language }) => ({
							name,
							language,
							artist_id: res.id,
						}))
					)
				}

				return res
			})
			.then((res) => this.findByID(res.id)) as Promise<Artist>
	}

	async findByKeyword(keyword: string, limit = 10) {
		return this.db.query.artist.findMany({
			where: (fields, op) => op.ilike(fields.name, `%${keyword}%`),
			limit,
			with: result_shape,
		})
	}
}

export const artist_model = new Elysia()
	.model({
		"artist::find_by_id": Schema.ok(artist_schema),
		"artist::new": new_artist_schema,
		"artist::find_by_keyword": Schema.ok(t.Array(artist_schema)),
	})
	.decorate("artist", new ArtistModel())
