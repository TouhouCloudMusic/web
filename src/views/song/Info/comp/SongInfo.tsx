/* @refresh skip */
import { useLingui } from "@lingui-solid/solid/macro"
import { Link } from "@tanstack/solid-router"
import type { ParentProps } from "solid-js"
import { For, Show } from "solid-js"

import { Image } from "~/components/image"
import { assertContext } from "~/utils/context"

import { SongContext } from ".."

export function SongInfo() {
	const { t } = useLingui()
	const context = assertContext(SongContext)

	return (
		<div class="grid h-fit grid-cols-[auto_1fr] space-x-8">
			<CoverImage />
			<div class="flex flex-col">
				<h1 class="text-xl font-semibold">{context.song.title}</h1>
				<div class="mt-4 space-y-4">
					<Artists />
					<LocalizedTitles />
					<Credits />
					<Languages />
				</div>
			</div>
		</div>
	)
}

function CoverImage() {
	return (
		<Image.Root>
			<Image.Fallback>
				{(state) =>
					state === Image.State.Error ?
						<div class="h-full aspect-square bg-slate-300 overflow-hidden rounded-md"></div>
					:	<></>
				}
			</Image.Fallback>
			<Image.Img 
				src="https://no" 
				class="h-full aspect-square object-cover overflow-hidden rounded-md"
			/>
		</Image.Root>
	)
}

function Artists() {
	const { t } = useLingui()
	const context = assertContext(SongContext)

	return (
		<Show when={context.song.artists?.length}>
			<div class="flex flex-col">
				<InfoLabel>{t`Artists`}</InfoLabel>
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

function LocalizedTitles() {
	const { t } = useLingui()
	const context = assertContext(SongContext)

	return (
		<Show when={context.song.localized_titles?.length}>
			<div class="flex flex-col">
				<InfoLabel>{t`Localized Titles`}</InfoLabel>
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

function Credits() {
	const { t } = useLingui()
	const context = assertContext(SongContext)

	return (
		<Show when={context.song.credits?.length}>
			<div class="flex flex-col">
				<InfoLabel>{t`Credits`}</InfoLabel>
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
								</Link> - {credit.role.name}
							</li>
						)}
					</For>
				</ul>
			</div>
		</Show>
	)
}

function Languages() {
	const { t } = useLingui()
	const context = assertContext(SongContext)

	return (
		<Show when={context.song.languages?.length}>
			<div class="flex flex-col">
				<InfoLabel>{t`Languages`}</InfoLabel>
				<ul class="flex flex-wrap gap-2">
					<For each={context.song.languages}>
						{(lang) => (
							<li>{lang.name}</li>
						)}
					</For>
				</ul>
			</div>
		</Show>
	)
}

function InfoLabel(props: ParentProps) {
	return <span class="text-sm text-tertiary">{props.children}</span>
}
