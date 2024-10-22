import Elysia from "elysia"
import { Schema } from "~/lib/schema"

export const id_model = new Elysia().model({
  id: Schema.id,
})
export type OmitColumnFromSchema<A, B> = {
  [K in keyof A | keyof B]?: true
}
