/* @refresh skip */
import { Trans } from "@lingui-solid/solid/macro"
import { createContext, Suspense } from "solid-js"

import type { Song } from "~/api/song"
import { PageLayout } from "~/layout/PageLayout"

import { SongInfoCoverImage } from "./comp/SongInfoCoverImage"
import { SongInfoCredit } from "./comp/SongInfoCredit"
import { SongInfoLanguages } from "./comp/SongInfoLanguages"
import { SongInfoRelease } from "./comp/SongInfoRelease"
import { SongInfoTitleAndCreditName } from "./comp/SongInfoTitleAndCreditName"

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
						<div class="grid h-fit grid-cols-[auto_1fr] space-x-8">
							<SongInfoCoverImage />
							<div class="flex flex-col">
								<SongInfoTitleAndCreditName />
								<div class="mt-4 h-48 space-y-4">
									<SongInfoLanguages />
								</div>
							</div>
						</div>
						<div class="grid gap-x-8 py-4 text-secondary lg:grid-cols-[1fr_auto]">
							<div class="flex flex-col gap-4">
								<h1 class="font-medium">
									<Trans>Release</Trans>
								</h1>
								<SongInfoRelease />
							</div>
							<div class="flex flex-col gap-4">
								<h1 class="font-medium">
									<Trans>Credits</Trans>
								</h1>
								<SongInfoCredit />
							</div>
						</div>
					</div>
				</SongInfoPageContext.Provider>
			</Suspense>
		</PageLayout>
	)
}
