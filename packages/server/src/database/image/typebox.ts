import { createInsertSchema, createSelectSchema } from "drizzle-typebox"
import { image_table } from "./schema"

export const image_schema = createSelectSchema(image_table)
export const new_image_schema = createInsertSchema(image_table)
