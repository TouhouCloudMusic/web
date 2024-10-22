import { smartMd5 } from "@touhouclouddb/utils"
import { eq } from "drizzle-orm"
import fs from "fs/promises"
import { image_table } from "~/database/schema"
import { DB, db } from "~/service/database"
export class ImageModel {
  private db: DB
  constructor(_db?: DB) {
    this.db = _db ?? db
  }

  private async writeFile(name: string, bytes: Uint8Array) {
    return await fs.writeFile(`${process.env.IMAGE_PATH}/${name}`, bytes)
  }

  async upload(user_id: number, image: File) {
    const bytes = await image.bytes()
    const image_hash = smartMd5(bytes)
    const { id: image_id } = (
      await this.db
        .insert(image_table)
        .values({
          filename: image_hash,
          uploaded_by: user_id,
        })
        .returning({ id: image_table.id })
    )[0]
    await this.writeFile(image_hash, bytes)

    return image_id
  }

  async deleteByHash(image_hash: string) {
    return await this.db
      .delete(image_table)
      .where(eq(image_table.filename, image_hash))
  }

  async deleteByID(id: number) {
    return await this.db.delete(image_table).where(eq(image_table.id, id))
  }
}
