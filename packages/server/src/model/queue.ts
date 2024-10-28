import { type EntityType } from "~/database/queue/typebox"
import { queue_table } from "~/database/schema"
import { type DB } from "~/service/database"

export class QueueModel {
  #db: DB
  constructor(db: DB) {
    this.#db = db
  }

  async create<T>(data: {
    author: number
    entity_id: number
    entity_type: EntityType
    old_data: T
    new_data: T
  }) {
    return await this.#db.insert(queue_table).values(data)
  }
}
