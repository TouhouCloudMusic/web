/* @refresh skip */
import { createContext, Suspense } from "solid-js"

import type { Song } from "~/api/song"
import { PageLayout } from "~/layout/PageLayout"
import { assertContext } from "~/utils/context"

import { Artists } from "./comp/Artists"
import { CoverImage } from "./comp/CoverImage"
import { Credits } from "./comp/Credits"
import { Languages } from "./comp/Languages"
import { LocalizedTitles } from "./comp/LocalizedTitles"

export type SongContext = {
	song: Song
}

export const SongContext = createContext<SongContext>()

export type SongInfoPageProps = {
	song: Song
}

export function SongInfoPage(props: SongInfoPageProps) {
	const contextValue: SongContext = {
		get song() {
			return props.song
		},
	}

	return (
		<PageLayout class="p-9">
			<Suspense fallback={<div>Loading...</div>}>
				<SongContext.Provider value={contextValue}>
					<Body />
				</SongContext.Provider>
			</Suspense>
		</PageLayout>
	)
}

function Body() {
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
