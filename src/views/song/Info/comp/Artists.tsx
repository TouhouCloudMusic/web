import { Trans } from "@lingui-solid/solid/macro"
import { Link } from "@tanstack/solid-router"
import { For, Show } from "solid-js"

import { assertContext } from "~/utils/context"

import { SongContext } from ".."
import { InfoLabel } from "./InfoLabel"

export function Artists() {
	const context = assertContext(SongContext)

	return (
		<Show when={context.song.artists?.length}>
			<div class="flex flex-col">
				<InfoLabel>
					<Trans>Artists</Trans>
				</InfoLabel>
				<ul class="flex flex-wrap gap-2">
					<For each={context.song.artists}>
						{(artist) => (
							<li>
								<Link
									to="/artist/$id"
									params={{ id: artist.id.toString() }}
									class="text-blue-600 hover:underline"
								>
									{artist.name}
								</Link>
							</li>
						)}
					</For>
				</ul>
			</div>
		</Show>
	)
}
