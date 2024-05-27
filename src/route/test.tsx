import { createAsync } from "@solidjs/router"
import { Show, Suspense, createResource } from "solid-js"
import { resetAutoIncrement } from "~/server/db/reset_auto_increment"
import { usePrisma } from "~/server/prisma/prisma"

async function findArtistWithAlias() {
	"use server"
	try {
		const prisma = usePrisma()
		const artist = await prisma.artist.findFirst({
			where: { id: 1 },
			include: { alias: { where: { NOT: { id: 1 } } } },
		})
		return artist
	} catch (e) {
		return e
	}
}

async function findArtistMember() {
	"use server"
	try {
		const prisma = usePrisma()
		const artist = await prisma.artist.findFirst({
			where: { id: 4 },
			include: { members: true },
		})
		return artist
	} catch (e) {
		return e
	}
}

async function addData() {
	"use server"
	try {
		const prisma = usePrisma()
		await prisma.artist.createMany({
			data: [
				{
					id: 1,
					name: "foo",
					alias_id: 1,
					type: "PERSON",
				},
				{
					id: 2,
					name: "bar",
					alias_id: 1,
					type: "PERSON",
				},
				{
					id: 3,
					name: "baz",
					alias_id: 1,
					type: "PERSON",
				},
			],
			skipDuplicates: true,
		})
		await prisma.artist.upsert({
			where: {
				id: 4,
			},
			update: {
				name: "test group",
				type: "GROUP",
				members: {
					connect: [{ id: 1 }, { id: 2 }, { id: 3 }],
				},
			},
			create: {
				name: "test group",
				type: "GROUP",
				members: {
					connect: [{ id: 1 }, { id: 2 }, { id: 3 }],
				},
			},
		})
		await prisma.artist.create({
			data: {
				id: 5,
				name: "test group 2",
				type: "GROUP",
			},
		})
		await prisma.artist.update({
			where: {
				id: 5,
			},
			data: {
				members: {
					connect: [{ id: 1 }],
				},
			},
		})
		return console.log("success")
	} catch (e) {
		console.log(e)
	}
}

async function findArtistMemberOf() {
	try {
		const prisma = usePrisma()
		const artist = await prisma.artist.findFirst({
			where: { id: 1 },
			include: { member_of: true },
		})
		return artist
	} catch (e) {
		return e
	}
}

export default function () {
	const [data] = createResource(() => findArtistWithAlias())
	const group = createAsync(() => findArtistMember())
	const findMemberTest = createAsync(() => findArtistMemberOf())
	return (
		<>
			<button
				class="button p-2"
				onClick={() => addData()}>
				Add
			</button>
			<button
				class="button p-2"
				onClick={() => resetAutoIncrement()}>
				Reset Auto Increment
			</button>
			<button
				class="button p-2"
				onClick={() => console.log(data())}>
				Log First Aritst
			</button>
			<button
				class="button p-2"
				onClick={() => console.log(group())}>
				Log Group Member
			</button>
			<button
				class="button p-2"
				onClick={() => console.log(findMemberTest())}>
				Log Member of Artist
			</button>
		</>
	)
}
