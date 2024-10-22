import { sql } from "drizzle-orm"
import { drizzle } from "drizzle-orm/connect"

const { DB_HOST, DB_PASSWORD, DB_USER, DB_NAME } = process.env
const url1 = `postgres://${DB_USER}:${DB_PASSWORD}@${DB_HOST}`

const db1 = await drizzle("postgres-js", {
  connection: {
    url: url1,
  },
  logger: true,
})

await db1.execute(
  sql.raw(`
	DO $$
	BEGIN
		IF NOT EXISTS (SELECT FROM pg_database WHERE datname = '${DB_NAME}') THEN
				PERFORM dblink_exec('dbname=postgres', 'CREATE DATABASE ${DB_NAME}');
		END IF;
	END
	$$;
	`),
)

const db2 = await drizzle("postgres-js", {
  connection: {
    url: `postgres://${DB_USER}:${DB_PASSWORD}@${DB_HOST}/${DB_NAME}`,
  },
  logger: true,
})

await db2.execute(
  sql.raw(`
		CREATE TYPE location_tuple AS (
			country 		text,
			subdivision text,
			city 				text
		);

		CREATE OR REPLACE FUNCTION update_updated_at_on_update()
		RETURNS TRIGGER AS $$
		BEGIN
			NEW.updated_at = now();
			RETURN NEW;
		END
		$$ language 'plpgsql'
	`),
)

await process.exit(0)
