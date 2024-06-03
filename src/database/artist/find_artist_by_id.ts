"use server"
import { usePrisma } from "../prisma_singleton"

const prisma = usePrisma()
export async function findArtistByID(id: number) {
	const res = await prisma.artist.findUnique({
		where: {
			id: id,
		},
		include: {
			member_of: true,
			members: true,
			release: {
				include: {
					release: true,
				},
			},
			release_credit: {
				include: {
					release: true,
					credit_role: true,
				},
			},
		},
	})
	return res
}
