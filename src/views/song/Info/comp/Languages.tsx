import { Trans } from "@lingui-solid/solid/macro"
import { For, Show } from "solid-js"

import { assertContext } from "~/utils/context"

import { SongContext } from ".."
import { InfoLabel } from "./InfoLabel"

export function Languages() {
	const context = assertContext(SongContext)

	return (
		<Show when={context.song.languages?.length}>
			<div class="flex flex-col">
				<InfoLabel>
					<Trans>Languages</Trans>
				</InfoLabel>
				<ul class="flex flex-wrap gap-2">
					<For each={context.song.languages}>
						{(lang) => <li>{lang.name}</li>}
					</For>
				</ul>
			</div>
		</Show>
	)
}
