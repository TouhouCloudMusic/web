"use server"
import { usePrisma } from "../prisma_singleton"

const prisma = usePrisma()
export async function addTestReleaseData() {
	// const data = {
	// 	id: 1,
	// 	title: "Lovelight",
	// 	artist: {
	// 		connect: {
	// 			id: 1,
	// 		},
	// 	},
	// 	credit: {
	// 		connect: [
	// 			{
	// 				id: 2, // arranger
	// 				artist_id: 2, // 小黑
	// 			},
	// 			{
	// 				id: 2, // arranger
	// 				artist_id: 3, // ryo ohnulki
	// 			},
	// 			{
	// 				id: 3, // vocal
	// 				artist_id: 4, // nomico
	// 			},
	// 			{
	// 				id: 4, // lyric,
	// 				artist_id: 5, // haruka
	// 			},
	// 			{
	// 				id: 5, // illustraion
	// 				artist_id: 6, // 深崎暮人
	// 			},
	// 		],
	// 	},
	// }
	await prisma.release.upsert({
		where: { id: 1 },
		update: {
			title: "Lovelight",
			artist: {
				connect: {
					id: 1,
				},
			},
			credit: {
				create: [
					{
						artist_id: 2, // 小黑
						credit_role: {
							connect: {
								id: 2, // arranger
							},
						},
					},
					{
						artist_id: 3, // ryo ohnulki
						credit_role: {
							connect: {
								id: 2, // arranger
							},
						},
					},
					{
						artist_id: 4, // nomico
						credit_role: {
							connect: {
								id: 3, // vocal
							},
						},
					},
					{
						artist_id: 5, // haruka
						credit_role: {
							connect: {
								id: 4, // lyric
							},
						},
					},
					{
						artist_id: 6, // 深崎暮人,
						credit_role: {
							connect: {
								id: 5, // illu
							},
						},
					},
				],
			},
		},
		create: {
			id: 1,
			title: "Lovelight",
			artist: {
				connect: {
					id: 1,
				},
			},
			credit: {
				create: [
					{
						artist_id: 2, // 小黑
						credit_role: {
							connect: {
								id: 2, // arranger
							},
						},
					},
					{
						artist_id: 3, // ryo ohnulki
						credit_role: {
							connect: {
								id: 2, // arranger
							},
						},
					},
					{
						artist_id: 4, // nomico
						credit_role: {
							connect: {
								id: 3, // vocal
							},
						},
					},
					{
						artist_id: 5, // haruka
						credit_role: {
							connect: {
								id: 4, // lyric
							},
						},
					},
					{
						artist_id: 6, // 深崎暮人,
						credit_role: {
							connect: {
								id: 5, // illu
							},
						},
					},
				],
			},
		},
	})
	// const release_id = 1
	// await prisma.releaseCredit.create({
	// 	data: {
	// 		release_id: release_id,
	// 		artist_id: 2, // 小黑
	// 		credit_role: {
	// 			connect: {
	// 				id: 2, // arranger
	// 			},
	// 		},
	// 	},
	// })
	// await prisma.releaseCredit.create({
	// 	data: {
	// 		release_id: release_id,
	// 		artist_id: 3, // ryo ohnulki
	// 		credit_role: {
	// 			connect: {
	// 				id: 2, // arranger
	// 			},
	// 		},
	// 	},
	// })
	// await prisma.releaseCredit.create({
	// 	data: {
	// 		release_id: release_id,
	// 		artist_id: 4, // nomico
	// 		credit_role: {
	// 			connect: {
	// 				id: 3, // vocal
	// 			},
	// 		},
	// 	},
	// })
	// await prisma.releaseCredit.create({
	// 	data: {
	// 		release_id: release_id,
	// 		artist_id: 5, // haruka
	// 		credit_role: {
	// 			connect: {
	// 				id: 4, // lyric
	// 			},
	// 		},
	// 	},
	// })
	// await prisma.releaseCredit.create({
	// 	data: {
	// 		release_id: release_id,
	// 		artist_id: 6, // 深崎暮人,
	// 		credit_role: {
	// 			connect: {
	// 				id: 5, // illu
	// 			},
	// 		},
	// 	},
	// })
}

// export async function getReleaseByID(id: number) {
// 	return await prisma.release.findUnique({
// 		where: {
// 			id: 1,
// 		},
// 	})
// }

export async function getReleaseByIDT() {
	const res = await prisma.release.findUnique({
		where: {
			id: 1,
		},
		include: {
			credit: {
				select: {
					artist: {
						select: {
							name: true,
						},
					},
					credit_role: {
						select: {
							// id: true,
							name: true,
						},
					},
				},
			},
			artist: {
				select: {
					// id: true,
					name: true,
				},
			},
			tracklist: true,
		},
	})
	return res
}
