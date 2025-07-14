import { Trans } from "@lingui-solid/solid/macro"
import { For, Show } from "solid-js"

import { assertContext } from "~/utils/context"

import { SongContext } from ".."
import { InfoLabel } from "./InfoLabel"

export function LocalizedTitles() {
	const context = assertContext(SongContext)

	return (
		<Show when={context.song.localized_titles?.length}>
			<div class="flex flex-col">
				<InfoLabel>
					<Trans>Localized Titles</Trans>
				</InfoLabel>
				<ul class="flex flex-col gap-1">
					<For each={context.song.localized_titles}>
						{(title) => (
							<li>
								{title.language.name}: {title.title}
							</li>
						)}
					</For>
				</ul>
			</div>
		</Show>
	)
}
