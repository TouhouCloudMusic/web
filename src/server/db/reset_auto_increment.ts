"use server"
import { usePrisma } from "../prisma/prisma"

export async function resetAutoIncrement() {
	const prisma = usePrisma()
	await prisma.$executeRaw`ALTER TABLE \`artist\` AUTO_INCREMENT = 1;`
	return
}
