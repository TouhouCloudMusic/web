/* @refresh skip */
import { createContext, Suspense } from "solid-js"

import type { Song } from "~/api/song"
import { PageLayout } from "~/layout/PageLayout"

import { SongPageBasicInfo } from "./comp/SongInfo"
import { SongInfoTabs } from "./comp/SongInfoTabs"

export type SongContext = {
	song: Song
}

export const SongContext = createContext<SongContext>()

type SongInfoPageProps = {
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
					<div class="flex flex-col gap-8">
						<SongPageBasicInfo />
						<SongInfoTabs />
					</div>
				</SongContext.Provider>
			</Suspense>
		</PageLayout>
	)
}
