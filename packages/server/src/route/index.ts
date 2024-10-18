import Elysia from "elysia"
import { artist_router } from "./artist"
import { release_router } from "./release"

export const api_router = new Elysia().use(artist_router).use(release_router)
