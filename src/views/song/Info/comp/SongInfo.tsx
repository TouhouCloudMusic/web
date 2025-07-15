/* @refresh skip */
import { Trans } from "@lingui-solid/solid/macro"
import { Link } from "@tanstack/solid-router"
import { createMemo, For, Match, Show, Switch } from "solid-js"

import { Info } from "~/components/common/Info"
import { Image } from "~/components/image"
import { assertContext } from "~/utils/context"

import { SongContext } from ".."

export function SongPageBasicInfo() {
	return (
		<div class="grid h-fit grid-cols-[auto_1fr] space-x-8">
			<CoverImage />
			<div class="flex flex-col">
				<TitleNCreditName />
				<div class="mt-4 h-48 space-y-4">
					<Languages />
				</div>
			</div>
		</div>
	)
}

// TODO:
// - Image src
// - Better fallback
//
function CoverImage() {
	const context = assertContext(SongContext)
	return (
		<Image.Root>
			<div class="isolate size-64">
				<Image.Fallback>
					{(state) =>
						state != Image.State.Ok && (
							<div class="size-full bg-slate-100"></div>
						)
					}
				</Image.Fallback>
				<Image.Img
					src={context.song.releases?.[0]?.cover_art_url ?? undefined}
					class="size-full"
				/>
			</div>
		</Image.Root>
	)
}

function TitleNCreditName() {
	const context = assertContext(SongContext)
	const localizedTitle = createMemo(
		() =>
			context.song.localized_titles?.find(
				// TODO: user defined language
				(title) => title.language.code === "en",
			) ??
			context.song.localized_titles?.find(
				// TODO: user defined language
				(title) => title.language.code === "ja",
			),
	)
	return (
		<div>
			<div class="flex items-baseline gap-2">
				<h1 class="text-xl font-semibold">{context.song.title}</h1>{" "}
				<Show when={localizedTitle()}>
					<span class="text-secondary">[{localizedTitle()!.title}]</span>
				</Show>
			</div>
			<div>
				<Switch>
					{/* TODO: Credit name */}
					<Match when={context.song.artists?.length}>
						<div class="flex flex-col">
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
						</div>
					</Match>
				</Switch>
			</div>
		</div>
	)
}

function Languages() {
	const context = assertContext(SongContext)

	return (
		<Show when={context.song.languages?.length}>
			<div class="flex flex-col">
				<Info.Label>
					<Trans>Languages</Trans>
				</Info.Label>
				<ul class="flex flex-wrap gap-2">
					<For each={context.song.languages}>
						{(lang) => <li>{lang.name}</li>}
					</For>
				</ul>
			</div>
		</Show>
	)
}
