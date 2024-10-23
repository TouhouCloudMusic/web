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
    const path = `${process.env.IMAGE_PATH}/${name}`
    if (process.isBun) return await Bun.write(path, bytes)
    else return await fs.writeFile(path, bytes)
  }

  private async removeFile(name: string) {
    const path = `${process.env.IMAGE_PATH}/${name}`
    return await fs.unlink(path)
  }

  async upload(user_id: number, image: File) {
    const bytes = await image.bytes()
    const extension_name = image.name.split(".").pop()
    const image_hash = smartMd5(bytes)
    const file_name = `${image_hash}.${extension_name}`
    const [{ image_id }] = await this.db
      .insert(image_table)
      .values({
        filename: file_name,
        uploaded_by: user_id,
      })
      .returning({ image_id: image_table.id })
    await this.writeFile(file_name, bytes)

    return image_id
  }

  async deleteByHash(image_hash: string) {
    const [{ filename }] = await this.db
      .delete(image_table)
      .where(eq(image_table.filename, image_hash))
      .returning({
        filename: image_table.filename,
      })

    await this.removeFile(filename)
  }

  async deleteByID(id: number) {
    const [{ filename }] = await this.db
      .delete(image_table)
      .where(eq(image_table.id, id))
      .returning({
        filename: image_table.filename,
      })

    await this.removeFile(filename)
  }
}
