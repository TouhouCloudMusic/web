import Elysia, { t } from "elysia"
import { new_song_schema, song_schema } from "~/database/song/typebox"
import { Response } from "~/lib/response"
import { ResponseSchema } from "~/lib/response/schema"
import { SongModel } from "~/model/song"
import type { DB } from "~/service/database"
import { auth_guard } from "~/service/user"

export const song_router = new Elysia({ prefix: "/song" })
  // @ts-expect-error
  .derive((ctx) => ({ SongModel: new SongModel(ctx.db as DB) }))
  .group(
    "/:id",
    {
      params: t.Object({
        id: ResponseSchema.id,
      }),
    },
    (router) =>
      router.get(
        "",
        async ({ SongModel, params: { id } }) => {
          const result = await SongModel.findByID(id)
          if (!result) return Response.notFound("Song Not Found")
          return Response.ok(result)
        },
        {
          response: {
            200: ResponseSchema.ok(new_song_schema),
            404: ResponseSchema.err,
          },
        },
      ),
  )
  .get(
    "/random",
    async ({ SongModel, params }) => {
      const result = await SongModel.random(params.count)
      return Response.ok(result)
    },
    {
      params: t.Object({
        count: t.Number({ minimum: 1, maximum: 20 }),
      }),
      response: ResponseSchema.ok(t.Array(song_schema)),
    },
  )
  .use(auth_guard)
  .post(
    "",
    async ({ SongModel, body }) => {
      const result = await SongModel.create(body)
      return Response.ok(result)
    },
    {
      body: new_song_schema,
      response: ResponseSchema.ok(song_schema),
    },
  )
