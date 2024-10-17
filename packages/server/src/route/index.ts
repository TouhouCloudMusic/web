import Elysia from "elysia"
import { artist_router } from "./artist"

export const api_router = new Elysia().use(artist_router)
