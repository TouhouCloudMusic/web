import { type date, type lang } from "@touhouclouddb/database/interfaces"
import { t, type TSchema } from "elysia"

const localized_langs = [
  "Chinese",
  "English",
  "Japanese",
  "Romanized",
] as const satisfies lang.Language[]

const date_masks = ["Full", "YM", "Y"] as const satisfies date.FormatMask[]

class ResponseSchema {
  constructor() {}
  id = t.Number(
    t.Integer({
      minimum: 1,
      error: "Invalid ID",
    }),
  )
  name = t.String({
    minLength: 1,
    maxLength: 127,
    error: "Invalid name",
  })
  title = t.String({
    minLength: 1,
    maxLength: 127,
    error: "Invalid title",
  })
  language = t.UnionEnum(localized_langs, {
    error: "Invalid language",
    default: undefined,
  })
  date_mask = t.UnionEnum(date_masks, {
    error: "Invalid date mask",
    default: undefined,
  })
  location = t.Object({
    country: t.String(),
    province: t.String(),
    city: t.String(),
  })
  err = t.Object({
    state: t.Literal("error"),
    message: t.String(),
  })
  keyword = t.String({
    minLength: 1,
    maxLength: 32,
    error: "Invalid keyword",
  })
  limit({
    minimum = 1,
    maximum = 100,
    default: defaultValue = 10,
  }: {
    minimum?: number
    maximum?: number
    default?: number
  } = {}) {
    return t.Number({
      minimum,
      maximum,
      default: defaultValue,
      error: "Invalid limit",
    })
  }
  ok<T extends TSchema>(schema: T) {
    return t.Object({
      state: t.Literal("success"),
      data: schema,
    })
  }
}

const schema = new ResponseSchema()

export { schema as ResponseSchema }
