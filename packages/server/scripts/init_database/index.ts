import create_database from "./create_database"
import create_type from "./create_type"
import init_lookup_table from "./init_lookup_table"

await create_database()
await create_type()
await init_lookup_table()
process.exit(0)
