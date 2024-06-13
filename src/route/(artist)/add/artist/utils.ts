import { ArtistType } from "@prisma/client"
import { ArtistDataByID } from "~/database/artist/find_artist_by_id"
import { ArtistForm } from "./type"

type MemberArtist = ArtistDataByID["members"][number]
type MemberGroup = ArtistDataByID["member_of"][number]
type Result = NonNullable<ArtistForm["member"]>[number]

export function initFormStore_Member(data: ArtistDataByID): Result[] {
	return data.type === "Person" ?
			data.member_of.map((a) => {
				if (a.group?.id) {
					return artistToLinkedMember(a, data.type)
				} else {
					return artistToTextMember(a, data.type)
				}
			})
		:	data.members.map((a) => {
				if (a.artist?.id) {
					return artistToLinkedMember(a, data.type)
				} else {
					return artistToTextMember(a, data.type)
				}
			})
}

function artistToLinkedMember(
	memberArtist: MemberArtist | MemberGroup,
	artistType: ArtistType
): Result {
	return {
		artist_id: memberArtist.id.toString(),
		group_member_id: memberArtist.id.toString(),
		type: artistType === "Group" ? "Person" : "Group",
		name: memberArtist.name ?? "",
		isString: false,
	}
}

function artistToTextMember(
	memberArtist: MemberArtist | MemberGroup,
	artistType: ArtistType
): Result {
	return {
		artist_id: "",
		group_member_id: memberArtist.id.toString(),
		type: artistType === "Group" ? "Person" : "Group",
		name: memberArtist.name ?? "",
		isString: true,
	}
}
