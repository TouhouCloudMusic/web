import { usePrisma } from "../prisma_singleton"

const db = usePrisma()
export const ArrangerID = 2
export const VocalID = 3
export const LyricID = 4
export const IllustrationID = 5

async function createCreditRole(name: string, desc_short?: string) {
	try {
		await db.creditRole.create({
			data: {
				name: name,
				desc_short: desc_short ?? "TODO",
			},
		})
	} catch (error) {
		throw new Error(`Error while create music role: ${name}`)
	}
}

export async function addTestCreditRoleData() {
	await createCreditRole("Composer")
	await createCreditRole("Arranger")
	await createCreditRole("Vocalist")
	await createCreditRole("Lyricist")
	await createCreditRole("Illustration")
}

// await addTestCreditRoleData() //done
