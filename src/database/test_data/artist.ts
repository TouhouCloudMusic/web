"use server"
import { usePrisma } from "../prisma_singleton"
const prisma = usePrisma()

async function createArtist(
	name: string,
	type: "Person" | "Group",
	member_of_id?: number
) {
	try {
		await prisma.artist.create({
			data: {
				name: name.trim(),
				type: type,
				member_of: {
					connect: {
						id: member_of_id,
					},
				},
			},
		})
		return
	} catch (e) {
		return e
	}
}

export async function addTestArtistData() {
	let step = 1
	const group_id = 1

	function errHandle(e: unknown) {
		throw [new Error(`Error while add artist data on step ${step}`), e]
	}
	try {
		step++
		await prisma.artist.create({
			data: {
				id: group_id,
				name: "Alstroemeria Records",
				type: "Group",
			},
		})
	} catch (e) {
		errHandle(e)
	}
	try {
		await createArtist("Masayoshi Minoshima", "Person", group_id)
	} catch (e) {
		errHandle(e)
	}
	try {
		await createArtist("	Ryo Ohnuki", "Person", group_id)
	} catch (e) {
		errHandle(e)
	}
	try {
		await createArtist("nomico", "Person", group_id)
	} catch (e) {
		errHandle(e)
	}
	try {
		await createArtist("Haruka", "Person", group_id)
	} catch (e) {
		errHandle(e)
	}
	try {
		await createArtist("深崎暮人", "Person", group_id)
	} catch (e) {
		errHandle(e)
	}
}
