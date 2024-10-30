import { config } from "dotenv"
import { drizzle } from "drizzle-orm/postgres-js"
import postgres from "postgres"
import { schema } from "~/database"

const { parsed, error } = config({ path: ".env.local" })
if (error) throw error
process.env = { ...process.env, ...parsed }

const { TEST_DB_HOST, TEST_DB_PASSWORD, TEST_DB_USER, TEST_DB_NAME } =
  process.env

const envs = [TEST_DB_HOST, TEST_DB_PASSWORD, TEST_DB_USER, TEST_DB_NAME]
envs.forEach((env) => {
  if (!env) {
    throw new Error(
      "Missing environment variable, Please setting test database env in your .env.local file",
    )
  }
})
export const test_db_url = `postgres://${TEST_DB_USER}:${TEST_DB_PASSWORD}@${TEST_DB_HOST}`
export const test_db_client = postgres(`${test_db_url}/${TEST_DB_NAME}`)
export const test_db = drizzle({
  schema,
  client: test_db_client,
  logger: false,
})
