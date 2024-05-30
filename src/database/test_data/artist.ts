import { pipe } from "fp-ts/lib/function"
import { usePrisma } from "../prisma_singleton"
const prisma = usePrisma()

async function addTestArtistData() {
	let step = 0
	function errHandle(e: unknown) {
		throw new Error(`Error while add artist data on step ${step}: ${e}`)
	}
	try {
		step++
		// 先添加团体
		await prisma.artist.create({
			data: {
				id: 1,
				name: "foo",
				type: "Group",
			},
		})
	} catch (e) {
		errHandle(e)
	}
	try {
		await prisma.artist.create({
			data: {
				id: 2,
				name: " foo",
				type: "Person",
				member_of: {
					// 将该成员链接至团体
					connect: {
						id: 1,
					},
				},
			},
		})
	} catch (e) {
		errHandle(e)
	}
	// 再添加成员
}
