import Elysia from "elysia"
import { artist_router } from "./artist"
import { release_router } from "./release"
import { song_router } from "./song"

export const api_router = new Elysia()
  .use(artist_router)
  .use(release_router)
  .use(song_router)
