"use server"
import { usePrisma } from "../prisma_singleton"
import { MasaID, nomicoID } from "./ids"

const prisma = usePrisma()
export async function addTestReleaseData() {
	await prisma.release.upsert({
		where: { id: 1 },
		update: {
			title: "Lovelight",
			artist: {
				create: {
					artist_id: 1,
				},
			},
			credits: {
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
			type: {
				create: {
					id: 1,
					name: "album",
				},
			},
		},
		create: {
			id: 1,
			title: "Lovelight",
			artist: {
				create: {
					artist_id: 1,
				},
			},
			credits: {
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
			type: {
				create: {
					id: 1,
					name: "album",
				},
			},
		},
	})
}
// await addTestReleaseData()
// await linkTrackListT() // done
async function linkTrackListT() {
	let order = 1
	let song_id = 1
	await prisma.release.update({
		where: { id: 1 },
		data: {
			tracklist: {
				create: {
					track_order: order++,
					song_id: song_id++,
					artist: { connect: { id: MasaID } },
				},
			},
		},
	})
	await prisma.release.update({
		where: { id: 1 },
		data: {
			tracklist: {
				create: {
					track_order: order++,
					song_id: song_id++,
					artist: {
						connect: [{ id: MasaID }, { id: nomicoID }],
					},
				},
			},
		},
	})
	await prisma.release.update({
		where: { id: 1 },
		data: {
			tracklist: {
				create: {
					track_order: order++,
					song_id: song_id++,
					artist: {
						connect: [{ id: MasaID }, { id: nomicoID }],
					},
				},
			},
		},
	})
	await prisma.release.update({
		where: { id: 1 },
		data: {
			tracklist: {
				create: {
					track_order: order++,
					song_id: song_id++,
					artist: {
						connect: [{ id: MasaID }],
					},
				},
			},
		},
	})
	await prisma.release.update({
		where: { id: 1 },
		data: {
			tracklist: {
				create: {
					track_order: order++,
					song_id: song_id++,
					artist: {
						connect: [{ id: 3 }],
					},
				},
			},
		},
	})
}
