import { drizzle } from "drizzle-orm/postgres-js"
import Elysia from "elysia"
import postgres from "postgres"
import * as schema from "~/database/schema"

const { DB_HOST, DB_NAME, DB_PASSWORD, DB_USER } = process.env
const url = `postgres://${DB_USER}:${DB_PASSWORD}@${DB_HOST}/${DB_NAME}`
export type DB = typeof db

const client = postgres(url)
export const db = drizzle({
  client,
  schema,
  logger: true,
})

export const database_service = (_db: DB = db) =>
  new Elysia({
    name: "Service::Database",
  }).decorate("db", _db)
