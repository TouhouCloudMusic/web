/* @refresh skip */
import { CreditList } from "~/components/domain/credit"
import { SongCreditStatics } from "~/domain/song"
import { assertContext } from "~/utils/context"

import { SongInfoPageContext } from ".."

export function SongInfoCredit() {
	const ctx = assertContext(SongInfoPageContext)

	return (
		<ul class="grid grid-cols-1 gap-y-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
			<CreditList
				credits={
					// This tab will hidden if credits is undefined or empty
					SongCreditStatics.groupByArtist(ctx.song.credits!).toSorted((a, b) =>
						a.artist.name.localeCompare(b.artist.name),
					)
				}
			/>
		</ul>
	)
}
