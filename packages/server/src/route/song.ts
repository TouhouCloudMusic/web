import { toError } from "@touhouclouddb/utils"
import Elysia, { t } from "elysia"
import { new_song_schema, song_schema } from "~/database/song/typebox"
import { Response } from "~/lib/response"
import { ResponseSchema } from "~/lib/response/schema"
import { SongModel } from "~/model/song"
import { auth_guard } from "~/service/user"

export const song_router = new Elysia({ prefix: "/song" })
  .decorate("model", new SongModel())
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
        async ({ model, params: { id } }) => {
          const result = await model.findByID(id)
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
  .use(auth_guard)
  .post(
    "",
    async ({ model, body }) => {
      try {
        const result = await model.create(body)
        return Response.ok(result)
      } catch (err) {
        return Response.err(500, toError(err).message)
      }
    },
    {
      body: new_song_schema,
      response: {
        200: ResponseSchema.ok(song_schema),
        500: ResponseSchema.err,
      },
    },
  )
