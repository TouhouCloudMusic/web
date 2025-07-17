/* @refresh skip */
import { CreditList } from "~/components/domain/credit"
import { SongCreditUtils } from "~/domain/song"
import { assertContext } from "~/utils/context"

import { SongInfoPageContext } from ".."

export function SongInfoCredit() {
	const ctx = assertContext(SongInfoPageContext)

	return (
		<ul class="flex flex-col gap-4">
			<CreditList
				credits={
					// This tab will hidden if credits is undefined or empty
					SongCreditUtils.groupByArtist(ctx.song.credits!).toSorted((a, b) =>
						a.artist.name.localeCompare(b.artist.name),
					)
				}
			/>
		</ul>
	)
}
