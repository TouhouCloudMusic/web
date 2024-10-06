import { drizzle } from "drizzle-orm/postgres-js"
import postgres from "postgres"
import * as schema from "../schema"

const { DB_HOST, DB_NAME, DB_PASSWORD, DB_USER } = process.env

const host = `postgres://${DB_USER}:${DB_PASSWORD}@${DB_HOST}/${DB_NAME}`

console.log(`🐛 Connected database at"${host}`)

const connection = postgres(
	`postgres://${DB_USER}:${DB_PASSWORD}@${DB_HOST}/${DB_NAME}`,
	{ connect_timeout: 10000 }
)

export const db = drizzle(connection, {
	schema,
})
