/* @refresh skip */
import { createContext, Suspense } from "solid-js"

import type { Song } from "~/api/song"
import { PageLayout } from "~/layout/PageLayout"

import { SongInfo } from "./comp/SongInfo"

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
					<SongInfo />
				</SongContext.Provider>
			</Suspense>
		</PageLayout>
	)
}
