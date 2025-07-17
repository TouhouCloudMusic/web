/* @refresh skip */
import { Link } from "@tanstack/solid-router"
import { createMemo, For, Match, Show, Switch } from "solid-js"

import { assertContext } from "~/utils/context"

import { SongInfoPageContext } from ".."

export function SongInfoTitleAndCreditName() {
	const context = assertContext(SongInfoPageContext)
	const localizedTitle = createMemo(
		() =>
			["en", "ja"].map((code) =>
				context.song.localized_titles?.find(
					// TODO: user defined language
					(title) => title.language.code === code,
				),
			)[0],
	)
	return (
		<div>
			<div class="mb-2 flex flex-wrap items-baseline">
				<h1 class="mr-2 text-xl font-medium text-slate-1000">
					{context.song.title}
				</h1>
				<Show when={localizedTitle()}>
					<span class="text-secondary">[{localizedTitle()!.title}]</span>
				</Show>
			</div>
			<div>
				<Switch>
					{/* TODO: Credit name */}
					<Match when={context.song.artists?.length}>
						<ul class="flex flex-wrap">
							<For each={context.song.artists}>
								{(artist, index) => (
									<li>
										{/* TODO: Link style */}
										<Link
											to="/artist/$id"
											params={{ id: artist.id.toString() }}
											class="text-blue-600 hover:underline"
										>
											{artist.name}
										</Link>
										{index() < context.song.artists!.length - 1 && (
											<span class="text-secondary">,&nbsp;</span>
										)}
									</li>
								)}
							</For>
						</ul>
					</Match>
				</Switch>
			</div>
		</div>
	)
}
