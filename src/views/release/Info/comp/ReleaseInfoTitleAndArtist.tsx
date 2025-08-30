import { Link } from "@tanstack/solid-router"
import { createMemo, For, Show } from "solid-js"

import { assertContext } from "~/utils/solid/assertContext"
import { getPreferredLocalizedTitle } from "~/utils"

import { ReleaseInfoPageContext } from ".."

export function ReleaseInfoTitleAndArtist() {
	const ctx = assertContext(ReleaseInfoPageContext)
	
	const preferredLocalizedTitle = createMemo(() =>
		getPreferredLocalizedTitle(ctx.release.localized_titles)
	)

	return (
		<div class="space-y-2">
			<h1 class="text-3xl font-bold text-slate-900">{ctx.release.title}</h1>

			<Show when={preferredLocalizedTitle()}>
				<p class="text-lg text-slate-600">
					{preferredLocalizedTitle()!.title}
					<Show when={preferredLocalizedTitle()?.language}>
						<span class="ml-2 text-sm text-slate-500">
							({preferredLocalizedTitle()!.language.name})
						</span>
					</Show>
				</p>
			</Show>

			<Show when={ctx.release.artists && ctx.release.artists.length > 0}>
				<div class="flex items-center space-x-1">
					<span class="text-slate-500">by</span>
					<For each={ctx.release.artists}>
						{(artist, index) => (
							<>
								<Link
									to="/artist/$id"
									params={{ id: artist.id.toString() }}
									class="text-primary underline-offset-4 transition-colors hover:underline"
								>
									{artist.name}
								</Link>
								<Show when={index() < ctx.release.artists!.length - 1}>
									<span class="text-slate-400">,</span>
								</Show>
							</>
						)}
					</For>
				</div>
			</Show>

			<div class="inline-block rounded-full bg-slate-100 px-2 py-1 text-sm text-slate-700">
				{ctx.release.release_type}
			</div>
		</div>
	)
}
