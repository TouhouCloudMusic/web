import type { UseQueryResult } from "@tanstack/solid-query"
import { Show } from "solid-js"

import type { Artist } from "~/api/artist"
import { Tab } from "~/components/common"
import { PageLayout } from "~/layout/PageLayout"

import { Info } from "./Info"

export type ArtistProfilePageProps = {
	query: UseQueryResult<Artist>
}

const TABS = ["Discography", "Appearance", "Credit"]
export function ArtistProfilePage(props: ArtistProfilePageProps) {
	return (
		<PageLayout class="p-10">
			{/* TODO: fallback */}
			<Show
				when={props.query.isSuccess && props.query.data}
				fallback={<div>Loading...</div>}
			>
				{(artist) => {
					return (
						<>
							<div class="grid h-fit grid-cols-[auto_1fr] space-x-8">
								<div class="size-64 bg-secondary"></div>
								<Info artist={artist()} />
							</div>
							<Tab.Root class="mt-16">
								<Tab.List class="grid grid-cols-3 w-fit">
									{TABS.map((item) => (
										<li>
											<Tab.Trigger
												class="px-6 py-3 size-full text-slate-800"
												value={item}
											>
												{item}
											</Tab.Trigger>
										</li>
									))}
									<Tab.Indicator />
								</Tab.List>
								<div class="w-full border-t border-slate-300">
									<Tab.Content value="Discography">
										<Discography />
									</Tab.Content>
								</div>
							</Tab.Root>

							{/* <div class="max-w-full wrap-anywhere">
								{JSON.stringify(props.query.data)}
							</div> */}
						</>
					)
				}}
			</Show>
		</PageLayout>
	)
}

type ReleaseMockData = {
	title: string
	releaseDate?: string
	artistName: string
}

const MOCK_RELEASES: ReleaseMockData[] = [
	{
		title: "東方紺珠伝 ~ Legacy of Lunatic Kingdom",
		releaseDate: "2015-08-14",
		artistName: "ZUN",
	},
	{
		title: "東方虹龍洞 ~ Unconnected Marketeers",
		releaseDate: "2021-05-04",
		artistName: "ZUN",
	},
	{
		title: "Touhou Kouryudou ~ Unconnected Marketeers OST",
		artistName: "ZUN",
	},
	{
		title: "大空魔術 ~ Magical Astronomy",
		releaseDate: "2006-08-13",
		artistName: "ZUN",
	},
	{
		title: "蓬莱人形 ~ Dolls in Pseudo Paradise",
		releaseDate: "2002-12-30",
		artistName: "ZUN",
	},
]

const RELEASE_TYPE = ["Album", "EP", "Single", "Compilation", "Live", "Demo"]

function Discography() {
	return (
		<div class="min-h-32 flex space-x-8">
			<ul class="flex w-fit flex-col space-y-4 border border-t-0 border-slate-300 px-8 py-4 text-slate-800">
				{RELEASE_TYPE.map((x) => (
					<li class="">{x}</li>
				))}
			</ul>
			<ul class="space-y-4 pt-8">
				{MOCK_RELEASES.sort((a, b) => {
					if (a.releaseDate && b.releaseDate) {
						return (
							new Date(a.releaseDate).getTime() -
							new Date(b.releaseDate).getTime()
						)
					}

					if (!a.releaseDate) {
						return 1
					}

					if (!b.releaseDate) {
						return -1
					}

					return 0
				}).map((release) => (
					<li class="flex h-16 space-x-4 ">
						<div class="size-16 bg-secondary rounded"></div>
						<div class="grid grid-rows-2 ">
							<div class="font-semibold text-slate-1000">{release.title}</div>

							<div class="text-sm text-secondary ">
								{release.artistName}
								{release.releaseDate && <> · {release.releaseDate}</>}
							</div>
						</div>
					</li>
				))}
			</ul>
		</div>
	)
}
