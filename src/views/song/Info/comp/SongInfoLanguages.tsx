/* @refresh skip */
import { Trans } from "@lingui-solid/solid/macro"
import { Show } from "solid-js"

import { Info } from "~/components/common/Info"
import { assertContext } from "~/utils/context"

import { SongInfoPageContext } from ".."

export function SongInfoLanguages() {
	const ctx = assertContext(SongInfoPageContext)

	return (
		<Show when={ctx.song.languages?.length}>
			<div class="flex flex-col">
				<Info.Label>
					<Trans>Languages</Trans>
				</Info.Label>
				<Info.List items={ctx.song.languages}>
					{(lang) => <li>{lang.name}</li>}
				</Info.List>
			</div>
		</Show>
	)
}
