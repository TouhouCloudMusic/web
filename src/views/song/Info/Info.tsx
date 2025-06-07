/* @refresh skip */
import { Info } from "~/components/common/Info"
import { assertContext } from "~/utils/context"

import { SongContext } from "."

export function SongInfo() {
	const context = assertContext(SongContext)

	let song = () => context.song
	return (
		<div>
			<h1 class="font-bold">{song().title}</h1>
			<Info.Item>
				<Info.Detail>{song().artist.name}</Info.Detail>
			</Info.Item>
		</div>
	)
}
