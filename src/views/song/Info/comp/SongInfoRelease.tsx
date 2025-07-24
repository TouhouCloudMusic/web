/* @refresh skip */
import { Show } from "solid-js"

import { ReleaseCoverWall } from "~/components/domain/release/ReleaseCoverWall"
import { assertContext } from "~/utils/context"

import { SongInfoPageContext } from ".."

export function SongInfoRelease() {
	const ctx = assertContext(SongInfoPageContext)
	return (
		<Show when={ctx.song.releases}>
			{(releases) => (
				<div class="grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8">
					<ReleaseCoverWall releases={releases()} />
				</div>
			)}
		</Show>
	)
}
