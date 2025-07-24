import { Trans } from "@lingui-solid/solid/macro"
import { createContext, Suspense } from "solid-js"

import type { Song } from "~/api/song"
import { Tab } from "~/components/common"
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
					<div class="grid grid-cols-[auto_1fr] gap-6">
						<SongInfoCoverImage />
						<div class="flex flex-col gap-4">
							<SongInfoTitleAndCreditName />
							<div class="space-y-4">
								<SongInfoLanguages />
							</div>
						</div>
						<div class="col-span-full">
							<SongInfoTabs />
						</div>
					</div>
				</SongInfoPageContext.Provider>
			</Suspense>
		</PageLayout>
	)
}

const TRIGGER_CLASS = "text-md px-6 py-2.5 text-slate-800"
function SongInfoTabs() {
	return (
		<Tab.Root>
			<Tab.List class="grid-cols-3">
				<Tab.Trigger
					value={"Release"}
					class={TRIGGER_CLASS}
				>
					<Trans>Release</Trans>
				</Tab.Trigger>
				<Tab.Trigger
					value={"Credits"}
					class={TRIGGER_CLASS}
				>
					<Trans>Credits</Trans>
				</Tab.Trigger>
				<Tab.Indicator />
			</Tab.List>
			<div class="pt-4">
				<Tab.Content value="Release">
					<SongInfoRelease />
				</Tab.Content>
				<Tab.Content value="Credits">
					<SongInfoCredit />
				</Tab.Content>
			</div>
		</Tab.Root>
	)
}
