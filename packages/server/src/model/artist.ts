import { AsyncReturnType } from "@touhouclouddb/utils"
import { eq } from "drizzle-orm"
import Elysia, { t } from "elysia"
import {
  Artist,
  artist_schema,
  ArtistLinks,
  new_artist_schema,
  NewArtist,
} from "~/database/artist/typebox"
import {
  artist,
  localized_name as localized_name_table,
} from "~/database/schema"
import { ResponseSchema } from "~/lib/response/schema"
import { db as _db, DB } from "~/service/database"
import { QueueModel } from "./queue"

type With = NonNullable<
  Parameters<typeof _db.query.artist.findFirst>[0]
>["with"]
type UnflattenedArtist = AsyncReturnType<typeof simulate_find>
type FlattenedArtist = Artist & ArtistLinks

const simulate_find = () => _db.query.artist.findFirst({ with: RETURN_WITH })

const RETURN_WITH = {
  alias_group: {
    columns: {},
    with: {
      artist: {
        columns: {
          id: true,
          name: true,
        },
      },
    },
  },
  localized_name: {
    columns: {
      language: true,
      name: true,
    },
  },
  to_members: {
    with: {
      member: {
        columns: {
          id: true,
          name: true,
        },
      },
    },
  },
  to_member_of: {
    with: {
      group: {
        columns: {
          id: true,
          name: true,
        },
      },
    },
  },
  to_release_artist: {
    columns: {},
    with: {
      release: {
        columns: {
          id: true,
          title: true,
        },
      },
    },
  },
} satisfies With

function flattenArtist<T extends UnflattenedArtist>(
  artist: T,
): T extends undefined ? undefined : NonNullable<T> & FlattenedArtist
function flattenArtist<T extends UnflattenedArtist>(artist: T) {
  if (artist)
    return {
      ...artist,
      aliases:
        artist.alias_group?.artist.filter(({ id }) => id !== artist.id) ?? [],
      release: artist.to_release_artist.map((x) => x.release),
      members: artist.to_members.map((x) => x.member),
      member_of: artist.to_member_of.map((x) => x.group),
    } satisfies NonNullable<T> & FlattenedArtist
}

class ArtistModel {
  private db: DB
  constructor(db?: DB) {
    this.db = db ?? _db
  }

  private $inner_queue_model?: QueueModel
  private get queue_model() {
    return (this.$inner_queue_model ??= new QueueModel(this.db))
  }

  async findByID(id: number): Promise<Artist | undefined> {
    return this.db.query.artist
      .findFirst({
        where: (fields, op) => op.eq(fields.id, id),
        with: RETURN_WITH,
      })
      .then(flattenArtist)
  }

  async findByKeyword(keyword: string, limit = 10) {
    return this.db.query.artist
      .findMany({
        where: (fields, op) => op.ilike(fields.name, `%${keyword}%`),
        limit,
        with: RETURN_WITH,
      })
      .then((x) => x.map(flattenArtist))
  }

  async create(data: NewArtist) {
    return this.db
      .transaction(async (tx) => {
        const res = (await tx.insert(artist).values(data).returning())[0]

        if (data.localized_name) {
          await tx.insert(localized_name_table).values(
            data.localized_name.map(({ name, language }) => ({
              name,
              language,
              artist_id: res.id,
            })),
          )
        }
        return res.id
      })
      .then((id) => this.findByID(id))
  }

  async createPullRequest({
    artist_data,
    artist_id,
    author_id,
  }: {
    artist_id: number
    artist_data: NewArtist
    author_id: number
  }) {
    const old_artist_data = await this.findByID(artist_id)
    if (!old_artist_data) {
      throw new Error(`artist ${artist_id} not found`)
    }
    return this.queue_model.create({
      author: author_id,
      entity_id: artist_id,
      entity_type: "Artist",
      new_data: artist_data,
      old_data: old_artist_data,
    })
  }

  async update(artist_id: number, data: NewArtist) {
    const { localized_name, ...artist_data } = data
    return this.db.transaction(async (tx) => {
      await tx
        .update(artist)
        .set(artist_data)
        .where(eq(artist.id, artist_id))
        .returning()

      if (localized_name && localized_name.length > 0) {
        await tx
          .delete(localized_name_table)
          .where(eq(localized_name_table.artist_id, artist_id))
        await tx.insert(localized_name_table).values(
          localized_name.map(({ name, language }) => ({
            name,
            language,
            artist_id,
          })),
        )
      }
    })
  }
}

export const artist_model = new Elysia()
  .model({
    "artist::new": new_artist_schema,
    "artist::find_by_id": ResponseSchema.ok(artist_schema),
    "artist::find_by_keyword": ResponseSchema.ok(t.Array(artist_schema)),
  })
  .decorate("model", new ArtistModel())
