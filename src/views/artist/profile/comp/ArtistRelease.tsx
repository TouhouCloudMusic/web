/* @refresh skip */
import { Trans } from "@lingui-solid/solid/macro"
import { createMemo, createSignal, For, Show, Suspense } from "solid-js"
import { twJoin } from "tailwind-merge"

import { RELEASE_TYPES, DateWithPrecision } from "~/api"
import type { ArtistRelease as TArtistRelease, ReleaseType } from "~/api"
import { Button } from "~/components/button"
import { Tab } from "~/components/common/Tab"
import { assertContext } from "~/utils/context"

import { ArtistContext } from ".."

type ArtistReleaseType = (typeof TABS)[number]

const TABS = ["Discography", "Appearance", "Credit"] as const
export function ArtistRelease() {
	const context = assertContext(ArtistContext)

	return (
		<Suspense fallback={<div>Loading...</div>}>
			<Show
				when={
					!(
						context.discographies.isLoading ||
						context.appearances.isLoading ||
						context.credits.isLoading
					)
				}
				fallback={<div>Loading...</div>}
			>
				<Inner />
			</Show>
		</Suspense>
	)
}

function Inner() {
	const context = assertContext(ArtistContext)
	return (
		// https://github.com/kobaltedev/kobalte/issues/222
		<Tab.Root>
			<Tab.List class="grid w-fit grid-cols-3">
				<For
					each={TABS.filter((tab) => {
						switch (tab) {
							case "Appearance":
								return context.appearances.data.length
							case "Credit":
								return context.credits.data.length
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
			<Tab.Content<ArtistReleaseType>
				value="Appearance"
				class="w-full border-t border-slate-300"
			>
				<ArtistReleases
					class="p-6"
					data={context.appearances.data}
					hasNext={context.appearances.hasNext}
					next={() => context.appearances.next()}
				/>
			</Tab.Content>
			<Tab.Content<ArtistReleaseType>
				value="Credit"
				class="w-full border-t border-slate-300"
			>
				<ArtistReleases
					class="p-6"
					data={context.credits.data}
					hasNext={context.credits.hasNext}
					next={() => context.credits.next()}
				/>
			</Tab.Content>
		</Tab.Root>
	)
}

function Discography() {
	const context = assertContext(ArtistContext)
	const [selectedType, setSelectedType] = createSignal<ReleaseType>("Album")

	const existingTypes = createMemo(() => {
		return RELEASE_TYPES.filter(
			(type) => context.discographies.data[type].length,
		)
	})

	return (
		<Show
			when={existingTypes().length}
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
						<For each={existingTypes()}>
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

				<ArtistReleases
					class="p-6"
					data={context.discographies.data[selectedType()]}
					hasNext={context.discographies.hasNext(selectedType())}
					next={() => context.discographies.next(selectedType())}
				/>
			</div>
		</Show>
	)
}

function ArtistReleases(props: {
	data?: TArtistRelease[] | undefined
	hasNext: boolean
	next: () => Promise<void>
	class?: string
}) {
	const context = assertContext(ArtistContext)

	return (
		<ul class={twJoin("space-y-4", props.class)}>
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

			<Show when={props.hasNext}>
				<div class="flex w-full justify-center">
					<Button
						variant="Tertiary"
						onClick={props.next}
						class="px-16 font-normal"
					>
						Load More
					</Button>
				</div>
			</Show>
		</ul>
	)
}
