import type { UseQueryResult } from "@tanstack/solid-query"
import { Show } from "solid-js"

import type { Artist } from "~/api/artist"
import { Tabs } from "~/components/common"
import { Image } from "~/components/image"
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
								<Image.Root>
									<Image.Fallback>
										{(state) =>
											state == Image.State.Error ?
												<div class="size-64 bg-slate-100"></div>
											:	<></>
										}
									</Image.Fallback>
									<Image.Img src={artist().profile_image_url ?? undefined} />
								</Image.Root>
								<Info artist={artist()} />
							</div>
							<Tabs.Root class="mt-16">
								<Tabs.List class="grid grid-cols-3 w-fit">
									{TABS.map((item) => (
										<li>
											<Tabs.Trigger
												class="px-4 py-2.5 size-full text-md text-slate-800"
												value={item}
											>
												{item}
											</Tabs.Trigger>
										</li>
									))}
									<Tabs.Indicator />
								</Tabs.List>
								<div class="w-full border-t border-slate-300">
									<Tabs.Content value="Discography">
										<Discography />
									</Tabs.Content>
								</div>
							</Tabs.Root>

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
