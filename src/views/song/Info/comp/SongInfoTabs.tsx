/* @refresh skip */
import { Trans } from "@lingui-solid/solid/macro"
import { Show } from "solid-js"

import { CreditList } from "~/components/domain/credit"
import { ReleaseCoverWall } from "~/components/domain/release/ReleaseCoverWall"
import { SongCreditUtils } from "~/domain/song"
import { assertContext } from "~/utils/context"

import { SongInfoPageContext } from ".."

// const TABS = [
// 	"Releases",
// 	"Credits",
// 	// "Lyrics"
// ] as const
// type Tabs = (typeof TABS)[number]
export function SongInfoTabs() {
	// const ctx = assertContext(SongInfoPageContext)
	// const visibleTabs = () =>
	// 	TABS.filter((tab) => {
	// 		switch (tab) {
	// 			case "Releases":
	// 				return ctx.song.releases && ctx.song.releases.length > 0
	// 			case "Credits":
	// 				return ctx.song.credits && ctx.song.credits.length > 0
	// 			// case "Lyrics":
	// 			// 	return ctx.song.lyrics
	// 			default:
	// 				return true
	// 		}
	// 	})
	return (
		<div class="grid gap-x-8 py-4 text-secondary lg:grid-cols-[1fr_auto]">
			<div class="flex flex-col gap-4">
				<h1 class="font-medium">
					<Trans>Release</Trans>
				</h1>
				<ReleaseTab />
			</div>
			<div class="flex flex-col gap-4">
				<h1 class="font-medium">
					<Trans>Credits</Trans>
				</h1>
				<CreditCard />
			</div>
		</div>
	)
}

function CreditCard() {
	const ctx = assertContext(SongInfoPageContext)

	return (
		<ul class="flex flex-col gap-4">
			<CreditList
				credits={
					// This tab will hidden if credits is undefined or empty
					SongCreditUtils.groupByArtist(ctx.song.credits!)
				}
			/>
		</ul>
	)
}

function ReleaseTab() {
	const ctx = assertContext(SongInfoPageContext)
	return (
		<Show when={ctx.song.releases}>
			{(releases) => (
				<div class="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
					<ReleaseCoverWall releases={releases()} />
				</div>
			)}
		</Show>
	)
}
