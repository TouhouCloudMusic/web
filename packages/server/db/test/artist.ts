import { eq } from "drizzle-orm"
import { db } from "."
import * as schema from "../schema"

// const sql = db
// 	.insert(schema.artist)
// 	.values({
// 		name: "test",
// 		artist_type: "Person",
// 		start_location: { country: "US", province: "CA", city: "San Francisco" },
// 	})
// 	.toSQL()

// console.log(sql)

// await db.insert(schema.artist).values({
// 	name: "test",
// 	artist_type: "Person",
// 	start_location: { country: "US", province: "CA", city: "San Francisco" },
// })

await db
	.update(schema.artist)
	.set({ name: "bar" })
	.where(eq(schema.artist.id, 1))

console.log("🐛 Inserted artist")

const res = await db.query.artist.findMany()
console.log(res)
