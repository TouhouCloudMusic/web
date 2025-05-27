import { Trans } from "@lingui-solid/solid/macro"
import { createMemo, createSignal, For, Show } from "solid-js"

import type { ArtistRelease as TArtistRelease } from "~/api/artist"
import type { ReleaseType } from "~/api/release"
import { RELEASE_TYPES } from "~/api/release"
import { DateWithPrecision } from "~/api/shared"
import { Tab } from "~/components/common/Tab"
import { assertContext } from "~/utils/context"

import { ArtistContext } from ".."

type ArtistReleaseType = (typeof TABS)[number]

const TABS = ["Discography", "Appearance", "Credit"] as const
export function ArtistRelease() {
	const context = assertContext(ArtistContext)
	return (
		<Tab.Root>
			<Tab.List class="grid w-fit grid-cols-3">
				<For
					each={TABS.filter((tabType) => {
						switch (tabType) {
							case "Appearance":
								return context.appearances.length
							case "Credit":
								return context.credits.length
							default:
								return true
						}
					})}
				>
					{(tabType) => (
						<li>
							<Tab.Trigger
								class="text-md size-full px-4 py-2.5 text-slate-800"
								value={tabType}
							>
								{tabType}
							</Tab.Trigger>
						</li>
					)}
				</For>
				<Tab.Indicator />
			</Tab.List>

			<Tab.Content<ArtistReleaseType>
				value="Discography"
				class="w-full border-t border-slate-300"
			>
				<Discography />
			</Tab.Content>
			<Show when={context.appearances.length}>
				<Tab.Content<ArtistReleaseType>
					value="Appearance"
					class="w-full border-t border-slate-300"
				>
					<></>
				</Tab.Content>
			</Show>
			<Show when={context.credits.length}>
				<Tab.Content<ArtistReleaseType>
					value="Credit"
					class="w-full border-t border-slate-300"
				>
					<></>
				</Tab.Content>
			</Show>
		</Tab.Root>
	)
}

function Discography() {
	const context = assertContext(ArtistContext)
	const [selectedType, setSelectedType] = createSignal<ReleaseType>("Album")

	// Keep the map on the heap instead of creating a new one each time
	const releaseMap = new Map<ReleaseType, TArtistRelease[]>()
	// Effect run after render so we have to use memo here
	const _ = createMemo(() => {
		releaseMap.clear()
		const sorted = context.discographies.toSorted((a, b) => {
			if (!a.release_date) {
				return 1
			}

			if (!b.release_date) {
				return -1
			}

			return (
				new Date(a.release_date.value).getTime() -
				new Date(b.release_date.value).getTime()
			)
		})

		// Perf: split to sperated array by type then push at once
		for (const release of sorted) {
			let arr = releaseMap.get(release.release_type)
			if (arr) {
				arr.push(release)
			} else {
				releaseMap.set(release.release_type, [release])
			}
		}
	})

	return (
		<Show
			when={RELEASE_TYPES.filter((type) => releaseMap.has(type)).length}
			fallback={
				<div class="m-auto flex min-h-16 items-center place-self-center pl-4 whitespace-pre text-secondary">
					<Trans>
						This Artist has no releases yet, you can upload them on{" "}
						<a
							href="TODO"
							class="text-blue-600"
						>
							Upload New Release
						</a>
					</Trans>
				</div>
			}
		>
			<div class="grid grid-cols-[auto_1fr]">
				<Tab.Root
					orientation="vertical"
					onChange={setSelectedType}
				>
					<Tab.List class="space-y-2 px-2 pt-6">
						<For each={RELEASE_TYPES.filter((type) => releaseMap.has(type))}>
							{(type) => (
								<Tab.Trigger
									value={type}
									class="flex h-10 items-center justify-center rounded-md px-2 text-center font-normal text-secondary outline-2 outline-offset-2 outline-transparent focus-visible:outline-slate-300 data-selected:bg-slate-100"
								>
									{type}
								</Tab.Trigger>
							)}
						</For>
					</Tab.List>
				</Tab.Root>
				<ul class="space-y-4 p-6">
					<ArtistReleases data={releaseMap.get(selectedType())} />
				</ul>
			</div>
		</Show>
	)
}

function ArtistReleases(props: { data?: TArtistRelease[] | undefined }) {
	const context = assertContext(ArtistContext)

	return (
		<For each={props.data}>
			{(release) => {
				const formatted = () => {
					const displayArtistName =
						release.artist.some((a) => a.name === context.artist.name) ?
							undefined
						:	release.artist.map((a) => a.name).join(", ")

					const releaseDate =
						release.release_date ?
							DateWithPrecision.display(release.release_date)
						:	undefined
					if (displayArtistName && releaseDate) {
						return `${displayArtistName} · ${releaseDate}`
					}

					if (displayArtistName) {
						return displayArtistName
					}

					if (releaseDate) {
						return releaseDate
					}

					return "N/A"
				}
				return (
					<li class="flex h-16 space-x-4">
						<div class="size-16 rounded bg-secondary"></div>
						<div class="grid grid-rows-2 items-center">
							<div class="font-semibold text-slate-1000">{release.title}</div>
							<div class="text-sm text-secondary">{formatted()}</div>
						</div>
					</li>
				)
			}}
		</For>
	)
}
