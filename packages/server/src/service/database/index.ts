import Elysia from "elysia"
import type { DB } from "./connection"

export const database_service = new Elysia({
  name: "Service::Database",
}).as("plugin") as unknown as Elysia<
  "",
  false,
  {
    decorator: {
      db: DB
    }
    store: Record<string, never>
    derive: Record<string, never>
    resolve: Record<string, never>
  }
>
