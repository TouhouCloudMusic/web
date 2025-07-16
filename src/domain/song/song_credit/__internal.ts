import type { SongCredit } from "~/api/song"

import type { GroupedSongCredit } from "."

export function groupByArtist(self: SongCredit[]): GroupedSongCredit[] {
	const map = new Map<number, GroupedSongCredit>()

	for (const credit of self) {
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
