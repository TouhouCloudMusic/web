import { either } from "fp-ts"

import { pipe } from "fp-ts/lib/function"
import { ArtistDataByID } from "~/database/artist/find_artist_by_id"
import { usePrisma } from "~/database/prisma_singleton"
import { stringToBigInt } from "~/lib/convert/string_to_bigint"
import { ArtistForm } from "./type"
import { action } from "@solidjs/router"

// eslint-disable-next-line @typescript-eslint/require-await
export async function createOrUpdateArtist(
	formData: ArtistForm,
	initData: ArtistDataByID | undefined
) {
	"use server"
	const prisma = usePrisma()
	const artistID = BigInt(formData.id)
	// 创建新艺术家
	if (formData.id === "") {
		return console.log("WIP")
	}
	// 更新现有艺术家
	else {
		if (formData.type === "Person") {
			if (initData) {
				// 删除已移除的成员
				const oldMemberIDList = initData.member_of.map((member) => member.id)
				const newMemberIDList =
					formData.member?.map((member) => BigInt(member.group_member_id)) ?? []
				const deleteGroupMember = oldMemberIDList.filter(
					(id) => !newMemberIDList.includes(id)
				)
				void deleteGroupMember.map(async (id) => {
					await prisma.groupMember.delete({
						where: {
							id: id,
						},
					})
				})
			}
			// 添加新成员
			const newGroupMembers = formData.member?.filter(
				(member) => member.group_member_id === ""
			)
			void newGroupMembers?.map(async (member) => {
				if (member.isString) {
					// 纯文本成员
					if (!member.name) throw new Error("A text member must have a name")
					await prisma.groupMember.create({
						data: {
							artist: {
								connect: {
									id: artistID,
								},
							},
							name: member.name,
						},
					})
				} else {
					// 链接成员
					await prisma.groupMember.create({
						data: {
							artist: {
								connect: {
									id: artistID,
								},
							},
							group: {
								connect: {
									id: BigInt(member.artist_id),
								},
							},
						},
					})
				}
			})
		}
		if (formData.type === "Group") {
			if (initData) {
				// 删除已移除的成员
				const oldMemberIDList = initData.members.map((member) => member.id)
				const newMemberIDList =
					formData.member?.map((member) => BigInt(member.group_member_id)) ?? []
				const deleteGroupMember = oldMemberIDList.filter(
					(id) => !newMemberIDList.includes(id)
				)
				void deleteGroupMember.map(async (id) => {
					await prisma.groupMember.delete({
						where: {
							id: id,
						},
					})
				})
			}
			// 添加新成员
			const newGroupMembers = formData.member?.filter(
				(member) => member.group_member_id === ""
			)
			void newGroupMembers?.map(async (member) => {
				if (member.isString) {
					// 纯文本成员
					if (!member.name) throw new Error("A text member must have a name")
					await prisma.groupMember.create({
						data: {
							group: {
								connect: {
									id: artistID,
								},
							},
							name: member.name,
						},
					})
				} else {
					// 链接成员
					await prisma.groupMember.create({
						data: {
							group: {
								connect: {
									id: artistID,
								},
							},
							artist: {
								connect: {
									id: BigInt(member.artist_id),
								},
							},
						},
					})
				}
			})
		}
	}
}

export const submitAction = action(
	async (formData: ArtistForm, initData: ArtistDataByID | undefined) => {
		console.log(formData)
		await createOrUpdateArtist(formData, initData)
		console.log("Ok")
	},
	"add_artist"
)
