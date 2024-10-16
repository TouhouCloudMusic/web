import Elysia, { t } from "elysia"
import { Response } from "~/lib/response"
import { Schema } from "~/lib/schema"
import { artist_model } from "~/model/artist"
import { auth_service, logged_in_info } from "~/service/user"

export const artist_router = new Elysia({ prefix: "/artist" })
  .use(artist_model)
  .use(auth_service)
  .get(
    "",
    async ({ artist, query: { keyword, limit } }) => {
      let result = await artist.findByKeyword(keyword, limit)
      if (result.length === 0) return Response.notFound("Artist Not Found")
      return Response.ok(result)
    },
    {
      query: t.Object({
        keyword: t.String({ maxLength: 32 }),
        limit: t.Number({ minimum: 1, maximum: 100, default: 10 }),
      }),
      response: {
        200: "artist::find_by_keyword",
        404: Schema.err,
      },
    },
  )
  .group(
    "/:id",
    {
      params: t.Object({
        id: t.Number({ minimum: 1 }),
      }),
    },
    ($) =>
      $.get(
        "",
        async ({ artist, params: { id } }) => {
          let res = await artist.findByID(id)
          return !res ? Response.notFound("Artist Not Found") : Response.ok(res)
        },
        {
          response: {
            200: "artist::find_by_id",
            404: Schema.err,
          },
        },
      ),
  )
  .use(logged_in_info)
  .post(
    "",
    async ({ artist, body }) => {
      return artist.insert(body)
    },
    {
      body: "artist::new",
    },
  )
