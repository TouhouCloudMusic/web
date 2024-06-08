"use server"
import { taskEither } from "fp-ts"
import { pipe } from "fp-ts/lib/function"
import { NotFoundError } from "~/lib/error/errors"
import { usePrisma } from "../prisma_singleton"
const prisma = usePrisma()

export type ArtistDataByID = Awaited<ReturnType<typeof find>>
const find = async (id: number) => {
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
	if (res === null) throw new NotFoundError(`Artist: ${id} not found`)
	return res
}

export async function findArtistByID(id: number) {
	// try {
	// 	throw new Error("bar")
	// 	return await find(id)
	// } catch (err) {
	// 	if (err instanceof Error) return err
	// 	if (typeof err === "string") return new Error(err)
	// 	else return new Error("unknown error")
	// }

	return await pipe(
		taskEither.tryCatch(
			() => find(id),
			(e) => {
				if (e instanceof Error) return e
				if (typeof e === "string") return new Error(e)
				else return new Error("unknown error")
			}
		)
	)()
}
