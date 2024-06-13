import { either } from "fp-ts"

import { pipe } from "fp-ts/lib/function"
import { ArtistDataByID } from "~/database/artist/find_artist_by_id"
import { usePrisma } from "~/database/prisma_singleton"
import { stringToBigInt } from "~/lib/convert/string_to_bigint"
import { ArtistForm } from "./type"

export function createOrUpdateArtist(
	formData: ArtistForm,
	initData: ArtistDataByID | undefined
) {
	"use server"
	const prisma = usePrisma()
	const artistID = BigInt(formData.id)
	// 创建新艺术家
	if (formData.id === "") {
		return console.log("WIP")

		// const connectArr = []
		// const member_of = formData.member.map((artist) => {
		// 	if (artist.memberArtistID !== "") {
		// 		return {
		// 			where: {
		// 				id: BigInt(artist.memberArtistID),
		// 			},
		// 			connect: {
		// 				id: BigInt(artist.memberArtistID),
		// 			},
		// 		}
		// 	} else {
		// 		return {
		// 			create: {
		// 				name: artist.name,
		// 				type: artist.type,
		// 			},
		// 		}
		// 	}
		// })
		// if (formData.type === "Person") {
		// 	await prisma.artist.create({
		// 		data: {
		// 			name: formData.name,
		// 			type: formData.type,
		// 			member_of: {
		// 				create: member_of,
		// 				connectArr,
		// 			},
		// 		},
		// 	})
		// }
		// if (formData.type === "Group") {
		// 	await prisma.artist.create({
		// 		data: {
		// 			name: formData.name,
		// 			type: formData.type,
		// 			members: {
		// 				connect: memberArr,
		// 			},
		// 		},
		// 	})
		// }
	}
	// 更新现有艺术家
	else {
		const id = pipe(
			formData.id,
			stringToBigInt,
			either.match(
				(err) => {
					throw err
				},
				(i) => i
			)
		)
		if (formData.type === "Person") {
			return console.log("WIP")
			// await prisma.artist.update({
			// 	where: {
			// 		id: id,
			// 	},
			// 	data: {
			// 		name: formData.name,
			// 		type: formData.type,
			// 		member_of: {
			// 			connect: memberArr,
			// 		},
			// 	},
			// })
		}
		if (formData.type === "Group") {
			if (initData) {
				// 删除已移除的成员
				const oldMemberIDList = initData.members.map((member) => member.id)
				const newMemberIDList = formData.member.map((member) =>
					BigInt(member.groupMemberID)
				)
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
			const newGroupMembers = formData.member.filter(
				(member) => member.groupMemberID === ""
			)
			void newGroupMembers.map(async (member) => {
				if (member.isString) {
					if (!member.name) throw new Error("A String")
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
				}
			})

			// const connectArr = []
			// const createArr = []
			void formData.member.map(async (memberArtist) => {
				// 没有GroupMember实例
				if (memberArtist.groupMemberID === "") {
					// 纯文本成员
					if (memberArtist.artist_id === "") {
						await prisma.artist.update({
							where: {
								id: artistID,
							},
							data: {
								members: {
									create: {
										name: memberArtist.name,
									},
								},
							},
						})
					}
					// 链接成员
					else {
						await prisma.artist.update({
							where: {
								id: BigInt(memberArtist.artist_id),
							},
							data: {
								members: {
									create: {
										artist: {
											connect: {
												id: BigInt(memberArtist.artist_id),
											},
										},
									},
								},
							},
						})
					}
				}
				// 存在GroupMember实例
				else {
					return
					// await prisma.artist.update({
					// 	where: {
					// 		id: BigInt(memberArtist.groupMemberID),
					// 	},
					// 	data: {
					// 		members: {
					// 			create: {
					// 				artist: {
					// 					connect: {
					// 						id: BigInt(memberArtist.memberArtistID),
					// 					},
					// 				},
					// 			},
					// 		},
					// 	},
					// })
				}
			})
			// await prisma.artist.update({
			// 	where: {
			// 		id: id,
			// 	},
			// 	data: {
			// 		name: formData.name,
			// 		type: formData.type,
			// 		members: {
			// 			set: [],
			// 			connect: connectArr,
			// 			create: createArr,
			// 		},
			// 	},
			// })
		}
	}
}
