import Elysia, { t } from "elysia"
import { Response } from "~/lib/response"
import { ResponseSchema } from "~/lib/response/schema"
import { artist_model } from "~/model/artist"
import { auth_guard } from "~/service/user"

export const artist_router = new Elysia({ prefix: "/artist" })
  .use(artist_model)
  .get(
    "",
    async ({ model, query: { keyword, limit } }) => {
      const result = await model.findByKeyword(keyword, limit)
      if (result.length === 0) return Response.notFound("Artist Not Found")
      return Response.ok(result)
    },
    {
      query: t.Object({
        keyword: ResponseSchema.keyword,
        limit: ResponseSchema.limit(),
      }),
      response: {
        200: "artist::find_by_keyword",
        404: ResponseSchema.err,
      },
    },
  )
  .group(
    "/:id",
    {
      params: t.Object({
        id: ResponseSchema.id,
      }),
    },
    (router) =>
      router
        .get(
          "",
          async ({ model, params: { id } }) => {
            const res = await model.findByID(id)
            return !res ?
                Response.notFound("Artist Not Found")
              : Response.ok(res)
          },
          {
            response: {
              200: "artist::find_by_id",
              404: ResponseSchema.err,
            },
          },
        )
        .use(auth_guard)
        .post(
          "",
          async ({ model, body, params: { id }, store: { session } }) => {
            return model.createPullRequest({
              artist_data: body,
              artist_id: id,
              author_id: session.user_id,
            })
          },
          {
            body: "artist::new",
          },
        ),
  )
  .use(auth_guard)
  .post(
    "",
    async ({ model, body }) => {
      return model.create(body)
    },
    {
      body: "artist::new",
    },
  )
