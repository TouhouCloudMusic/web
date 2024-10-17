import Elysia, { t } from "elysia"
import { Response } from "~/lib/response"
import { Schema } from "~/lib/schema"
import { artist_model } from "~/model/artist"
import { auth_guard } from "~/service/user"

export const artist_router = new Elysia({ prefix: "/artist" })
  .use(artist_model)
  .get(
    "",
    async ({ artist, query: { keyword, limit } }) => {
      let result = await artist.findByKeyword(keyword, limit)
      if (result.length === 0) return Response.notFound("Artist Not Found")
      return Response.ok(result)
    },
    {
      query: t.Object({
        keyword: Schema.keyword,
        limit: Schema.limit(),
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
        id: Schema.id,
      }),
    },
    (router) =>
      router
        .get(
          "",
          async ({ artist, params: { id } }) => {
            let res = await artist.findByID(id)
            return !res ?
                Response.notFound("Artist Not Found")
              : Response.ok(res)
          },
          {
            response: {
              200: "artist::find_by_id",
              404: Schema.err,
            },
          },
        )
        .use(auth_guard)
        .post(
          "",
          async ({ artist, body, params: { id } }) => {
            return artist.update(id, body)
          },
          {
            body: "artist::new",
          },
        ),
  )
  .use(auth_guard)
  .post(
    "",
    async ({ artist, body }) => {
      return artist.insert(body)
    },
    {
      body: "artist::new",
    },
  )
