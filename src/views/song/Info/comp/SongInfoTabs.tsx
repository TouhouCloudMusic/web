/* @refresh skip */
import { For } from "solid-js"

import { Tab } from "~/components/common"
import { CreditList } from "~/components/domain/credit"
import { Image } from "~/components/image"
import { groupSongCreditsByArtist } from "~/domain/song"
import { assertContext } from "~/utils/context"

import { SongInfoPageContext } from ".."

const TABS = [
	"Releases",
	"Credits",
	// "Lyrics"
] as const
type Tabs = (typeof TABS)[number]
export function SongInfoTabs() {
	const ctx = assertContext(SongInfoPageContext)
	const visibleTabs = () =>
		TABS.filter((tab) => {
			switch (tab) {
				case "Releases":
					return ctx.song.releases && ctx.song.releases.length > 0
				case "Credits":
					return ctx.song.credits && ctx.song.credits.length > 0
				// case "Lyrics":
				// 	return ctx.song.lyrics
				default:
					return true
			}
		})
	return (
		<Tab.Root>
			<Tab.List>
				<For each={visibleTabs()}>
					{(tabType) => (
						<li>
							{/* TODO: Refactor this to a component */}
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
			<Tab.Content<Tabs> value="Releases">
				<ReleaseTab />
			</Tab.Content>
			<Tab.Content<Tabs> value="Credits">
				<CreditTab />
			</Tab.Content>
		</Tab.Root>
	)
}

function CreditTab() {
	const ctx = assertContext(SongInfoPageContext)

	return (
		<ul class="flex flex-col gap-4 py-4 pl-4">
			<CreditList
				credits={
					// This tab will hidden if credits is undefined or empty
					groupSongCreditsByArtist(ctx.song.credits!)
				}
			/>
		</ul>
	)
}
function ReleaseTab() {
	const ctx = assertContext(SongInfoPageContext)

	return (
		<div class="grid grid-cols-2 gap-4 py-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
			<For each={ctx.song.releases}>
				{(release) => (
					<div class="flex flex-col gap-2">
						<div class="aspect-square overflow-hidden">
							<Image.Root>
								<Image.Img
									src={release.cover_art_url ?? undefined}
									alt={release.title}
									class="h-full w-full object-cover"
								/>
								<Image.Fallback>
									{(state) =>
										state !== Image.State.Ok && (
											// TODO: Better fallback
											<div class="flex h-full w-full items-center justify-center bg-gray-200">
												<span class="text-sm text-gray-500">No Cover Art</span>
											</div>
										)
									}
								</Image.Fallback>
							</Image.Root>
						</div>
						<div class="text-center">
							<p class="line-clamp-2 text-sm font-medium text-gray-900">
								{release.title}
							</p>
						</div>
					</div>
				)}
			</For>
		</div>
	)
}
