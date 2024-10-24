import { sql } from "drizzle-orm"
import db from "./connection"

export default async function main() {
  await db.execute(
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
}
