import { createMemo, createSignal, For } from "solid-js"

import type { ReleaseType } from "~/api/release"
import { Tab } from "~/components/common/Tab"
import { assertContext } from "~/utils/context"

import { ArtistContext } from "../context"

const RELEASE_TYPES: ReleaseType[] = [
	"Album",
	"Ep",
	"Single",
	"Compilation",
	"Demo",
	"Other",
] as const

export function ArtistRelease() {
	return (
		<Tab.Root>
			<Tab.List class="grid w-fit grid-cols-3">
				<For each={["Discography", "Appearance", "Credit"]}>
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
			<div class="w-full border-t border-slate-300">
				<Tab.Content value="Discography">
					<Discography />
				</Tab.Content>
				<Tab.Content value="Appearance">
					<></>
				</Tab.Content>
				<Tab.Content value="Credit">
					<></>
				</Tab.Content>
			</div>
		</Tab.Root>
	)
}

type ReleaseMockData = {
	title: string
	releaseDate?: string
	artistName: string
	type: ReleaseType
}

const MOCK_RELEASES: ReleaseMockData[] = [
	{
		title: "東方紺珠伝 ~ Legacy of Lunatic Kingdom",
		releaseDate: "2015-08-14",
		artistName: "ZUN",
		type: "Album",
	},
	{
		title: "東方虹龍洞 ~ Unconnected Marketeers",
		releaseDate: "2021-05-04",
		artistName: "ZUN",
		type: "Album",
	},
	{
		title: "Touhou Kouryudou ~ Unconnected Marketeers OST",
		artistName: "ZUN",
		type: "Album",
	},
	{
		title: "大空魔術 ~ Magical Astronomy",
		releaseDate: "2006-08-13",
		artistName: "ZUN",
		type: "Compilation",
	},
	{
		title: "蓬莱人形 ~ Dolls in Pseudo Paradise",
		releaseDate: "2002-12-30",
		artistName: "ZUN",
		type: "Album",
	},
]

function Discography() {
	const [selectedType, setSelectedType] = createSignal<ReleaseType>("Album")

	const releaseData = () => MOCK_RELEASES
	// Keep the map on the heap instead of creating a new one each time
	const releaseMap = new Map<ReleaseType, ReleaseMockData[]>()
	// Effect run after render so we have to use memo here
	const _ = createMemo(() => {
		releaseMap.clear()
		const sorted = releaseData().toSorted((a, b) => {
			if (!a.releaseDate) {
				return 1
			}

			if (!b.releaseDate) {
				return -1
			}

			return (
				new Date(a.releaseDate).getTime() - new Date(b.releaseDate).getTime()
			)
		})

		// Perf: split to sperated array by type then push at once
		for (const release of sorted) {
			let arr = releaseMap.get(release.type)
			if (arr) {
				arr.push(release)
			} else {
				releaseMap.set(release.type, [release])
			}
		}
	})

	return (
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
								class="flex h-10 items-center justify-center rounded-md px-2 text-center font-normal text-slate-900 outline-2 outline-offset-2 outline-transparent focus-visible:outline-slate-300 data-selected:bg-slate-100"
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
	)
}

function ArtistReleases(props: { data?: ReleaseMockData[] | undefined }) {
	const context = assertContext(ArtistContext)
	return (
		<For each={props.data}>
			{(release) => {
				const formatted = () => {
					const displayArtistName =
						release.artistName === context.artist.name ?
							undefined
						:	release.artistName

					const releaseDate = release.releaseDate
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
