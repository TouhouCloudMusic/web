import Elysia from "elysia"
import { ResponseSchema } from "~/lib/response/schema"

export const id_model = new Elysia().model({
  id: ResponseSchema.id,
})
export type OmitColumnFromSchema<A, B> = {
  [K in keyof A | keyof B]: true
}
