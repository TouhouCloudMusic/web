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
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    if (process.isBun) return await Bun.write(path, bytes)
    else {
      await fs.writeFile(path, bytes)
      return
    }
  }

  private async removeFile(name: string) {
    const path = `${process.env.IMAGE_PATH}/${name}`
    await fs.unlink(path)
  }

  async upload(
    user_id: number,
    {
      bytes,
      extension_name,
    }: {
      bytes: Uint8Array
      extension_name: string
    },
  ) {
    const image_hash = smartMd5(bytes)
    const file_name = `${image_hash}.${extension_name}`
    const [img] = await this.db
      .insert(image_table)
      .values({
        filename: file_name,
        uploaded_by: user_id,
      })
      .returning()
    await this.writeFile(file_name, bytes)

    return img
  }

  async deleteByHash(image_hash: string) {
    const [{ filename }] = await this.db
      .delete(image_table)
      .where(eq(image_table.filename, image_hash))
      .returning({
        filename: image_table.filename,
      })
      .then((x) => {
        if (!x.length) throw new Error("No such image")
        return x
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
      .then((x) => {
        if (!x.length) throw new Error("No such image")
        return x
      })

    await this.removeFile(filename)
  }
}
