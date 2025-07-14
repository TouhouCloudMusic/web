import { Trans } from "@lingui-solid/solid/macro"
import { Link } from "@tanstack/solid-router"
import { For, Show } from "solid-js"

import { assertContext } from "~/utils/context"

import { SongContext } from ".."
import { InfoLabel } from "./InfoLabel"

export function Credits() {
	const context = assertContext(SongContext)

	return (
		<Show when={context.song.credits?.length}>
			<div class="flex flex-col">
				<InfoLabel>
					<Trans>Credits</Trans>
				</InfoLabel>
				<ul class="flex flex-col gap-1">
					<For each={context.song.credits}>
						{(credit) => (
							<li>
								<Link
									to="/artist/$id"
									params={{ id: credit.artist.id.toString() }}
									class="text-blue-600 hover:underline"
								>
									{credit.artist.name}
								</Link>{" "}
								- {credit.role.name}
							</li>
						)}
					</For>
				</ul>
			</div>
		</Show>
	)
}
