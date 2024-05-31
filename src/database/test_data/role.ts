import { usePrisma } from "../prisma_singleton"

const db = usePrisma()

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
