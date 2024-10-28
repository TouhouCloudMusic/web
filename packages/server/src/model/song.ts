import { song } from "~/database/schema"
import { type NewSong, type Song } from "~/database/song/typebox"
import { type DB, db } from "~/service/database"

export class SongModel {
  #db: DB
  constructor() {
    this.#db = db
  }

  async findByID(id: number): Promise<Song | undefined> {
    return await this.#db.query.song.findFirst({
      where: (fields, op) => op.eq(fields.id, id),
    })
  }

  async findByKeyword(keyword: string, limit = 10): Promise<Song[]> {
    return await this.#db.query.song.findMany({
      where: (fields, op) => op.ilike(fields.title, `%${keyword}%`),
      limit,
    })
  }

  async create(data: NewSong) {
    return (await this.#db.insert(song).values(data).returning())[0]
  }
}
