import Elysia, { t } from "elysia"
import { artist_schema, new_artist_schema } from "~/database/artist/typebox"
import { Response } from "~/lib/response"

export const artist_dto = new Elysia({
  name: "Dto::Artist",
})
  .model({
    "artist::create": new_artist_schema,
    "artist::update": new_artist_schema,
    "artist::find_by_id": Response.ok.schema(new_artist_schema),
    "artist::find_by_keyword": Response.ok.schema(t.Array(artist_schema)),
  })
  .as("plugin")
