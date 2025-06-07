/* @refresh skip */
import { createContext, Suspense } from "solid-js"

import type { Song } from "~/api/song"
import { PageLayout } from "~/layout/PageLayout"

import { SongInfo } from "./Info"

export type SongContext = {
	song: Song
}

export const SongContext = createContext<SongContext>()

export interface SongInfoProps {
	song: Song
}

export function SongInfoPage(props: SongInfoProps) {
	const contextValue: SongContext = {
		get song() {
			return props.song
		},
	}

	return (
		<PageLayout class="p-9">
			<Suspense
				fallback={
					<div class="py-8 text-center">Loading song information...</div>
				}
			>
				<SongContext.Provider value={contextValue}>
					<SongInfo />
				</SongContext.Provider>
			</Suspense>
		</PageLayout>
	)
}
