import { SimpleArtist } from "~/api/artist/schema"
import { CreditRole } from "~/api/credit"
import { SongCredit } from "~/api/song"

export type GroupedSongCredit = { artist: SimpleArtist; roles: CreditRole[] }
export function groupSongCreditsByArtist(
	credits: SongCredit[],
): GroupedSongCredit[] {
	const map: Map<number, GroupedSongCredit> = new Map()

	for (const credit of credits) {
		const artistId = credit.artist.id
		const role = credit.role

		const group = map.get(artistId)

		if (group) {
			group.roles.push(role)
		} else {
			map.set(artistId, { artist: credit.artist, roles: [role] })
		}
	}

	return map
		.values()
		.toArray()
		.sort((a, b) => a.artist.name.localeCompare(b.artist.name))
}
