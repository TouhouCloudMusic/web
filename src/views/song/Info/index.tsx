/* @refresh skip */
import { createContext, Suspense } from "solid-js"

import type { Song } from "~/api/song"
import { PageLayout } from "~/layout/PageLayout"

import { SongInfoDetails } from "./comp/SongInfoDetails"
import { SongInfoTabs } from "./comp/SongInfoTabs"

export type SongInfoPageContext = {
	song: Song
}

export const SongInfoPageContext = createContext<SongInfoPageContext>()

type SongInfoPageProps = {
	song: Song
}

export function SongInfoPage(props: SongInfoPageProps) {
	const contextValue: SongInfoPageContext = {
		get song() {
			return props.song
		},
	}

	return (
		<PageLayout class="p-9">
			<Suspense fallback={<div>Loading...</div>}>
				<SongInfoPageContext.Provider value={contextValue}>
					<div class="flex flex-col gap-8">
						<SongInfoDetails />
						<SongInfoTabs />
					</div>
				</SongInfoPageContext.Provider>
			</Suspense>
		</PageLayout>
	)
}
