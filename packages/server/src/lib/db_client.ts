import * as schema from "db/schema"
import { drizzle } from "drizzle-orm/postgres-js/driver.js"
import postgres from "postgres"

const { DB_HOST, DB_NAME, DB_PASSWORD, DB_USER } = process.env
const url = `postgres://${DB_USER}:${DB_PASSWORD}@${DB_HOST}/${DB_NAME}`

const connection = postgres(url, { connect_timeout: 10000 })

export type DB = typeof db
export const db = drizzle(connection, { schema })
