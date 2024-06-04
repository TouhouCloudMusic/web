import type { Prisma } from "@prisma/client"
import { usePrisma } from "../prisma_singleton"
import { MasaID } from "./ids"
import { ArrangerID } from "./role"
const prisma = usePrisma()

// 不要导出，不然服务器启动后会运行一次
async function createTestSongData() {
	let id = 1

	const sd1: Prisma.SongCreateInput = {
		id: id++,
		title: "Lovelight",
		artist: {
			connect: {
				id: 2,
			},
		},
		credits: {
			create: {
				artist_id: 2,
				roles: {
					connect: {
						id: 1,
					},
				},
			},
		},
	}
	id++

	const sd3: Prisma.SongCreateInput = {
		id: id++,
		title: "Witherd Leaf",
		artist: {
			connect: {
				id: MasaID,
			},
		},
		credits: {
			create: {
				artist_id: MasaID,
				roles: {
					connect: {
						id: ArrangerID,
					},
				},
			},
		},
	}
	const sd4: Prisma.SongCreateInput = {
		id: id++,
		title: "Magic Girl",
		artist: {
			connect: {
				id: MasaID,
			},
		},
		credits: {
			create: {
				artist_id: MasaID,
				roles: {
					connect: {
						id: ArrangerID,
					},
				},
			},
		},
	}
	const sd5: Prisma.SongCreateInput = {
		id: id++,
		title: "Silver That Can Be Crushed Like Crystal.",
		artist: {
			connect: {
				id: 3,
			},
		},
		credits: {
			create: {
				artist_id: 3,
				roles: {
					connect: {
						id: ArrangerID,
					},
				},
			},
		},
	}
	const sdArr = [sd1, sd3, sd4, sd5]
	await Promise.all(
		sdArr.map((d) =>
			prisma.song.create({
				data: d,
			})
		)
	).catch((e) => {
		throw e
	})
}
await prisma.song.create({
	data: {
		id: 2,
		title: "Bad Apple!! feat. nomico",
		artist: {
			connect: [
				{
					id: 2,
				},
				{
					id: 4,
				},
			],
		},
	},
})
// credits: {
// 	create: {
// 		data: [
// 			{
// 				artist_id: 2,
// 				credit_role_id: 2,
// 			},
// 			{
// 				artist_id: 4,
// 				credit_role_id: 3,
// 			},
// 			{
// 				artist_id: 5,
// 				credit_role_id: 4,
// 			},
// 		],
// 		skipDuplicates: true,
// 	},
// },
await prisma.song.update({
	where: {
		id: 2,
	},
	data: {
		credits: {
			create: {
				artist_id: 2,
				roles: { connect: { id: 2 } },
			},
		},
	},
})
await prisma.song.update({
	where: {
		id: 2,
	},
	data: {
		credits: {
			create: {
				artist_id: 4,
				roles: { connect: { id: 3 } },
			},
		},
	},
})
await prisma.song.update({
	where: {
		id: 2,
	},
	data: {
		credits: {
			create: {
				artist_id: 5,
				roles: { connect: { id: 4 } },
			},
		},
	},
})

await createTestSongData()
