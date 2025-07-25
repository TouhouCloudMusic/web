import { Trans } from "@lingui-solid/solid/macro"
import { createContext, For, Show, Suspense } from "solid-js"

import type { Release } from "~/api/release"
import { Tab } from "~/components/common"
import { CreditList } from "~/components/domain/credit"
import { SongCreditStatics } from "~/domain/song"
import { PageLayout } from "~/layout/PageLayout"
import { assertContext } from "~/utils/context"

export type ReleaseInfoPageContext = {
	release: Release
	keyword?: string | undefined
}

export const ReleaseInfoPageContext = createContext<ReleaseInfoPageContext>()

type ReleaseInfoPageProps = {
	release: Release
	keyword?: string | undefined
}

export function ReleaseInfoPage(props: ReleaseInfoPageProps) {
	const contextValue: ReleaseInfoPageContext = {
		get release() {
			return props.release
		},
		get keyword() {
			return props.keyword
		},
	}

	return (
		<PageLayout class="p-8">
			<Suspense fallback={<div>Loading...</div>}>
				<ReleaseInfoPageContext.Provider value={contextValue}>
					<div class="grid grid-cols-[auto_1fr] gap-8">
						<ReleaseInfoCoverImage />
						<div class="flex flex-col gap-y-4">
							<ReleaseInfoTitleAndArtists />
							<ReleaseInfoMetadata />
						</div>
						<div class="col-span-full">
							<ReleaseInfoTabs />
						</div>
					</div>
				</ReleaseInfoPageContext.Provider>
			</Suspense>
		</PageLayout>
	)
}

function ReleaseInfoCoverImage() {
	return (
		<div class="h-64 w-64">
			<img
				class="h-full w-full rounded-lg object-cover shadow-lg"
				src="https://picsum.photos/400/400?random=1"
				alt="Release Cover"
			/>
		</div>
	)
}

function ReleaseInfoTitleAndArtists() {
	const ctx = assertContext(ReleaseInfoPageContext)
	
	return (
		<div class="flex flex-col gap-y-2">
			<h1 class="text-3xl font-bold">
				{ctx.release.localized_titles?.[0]?.title || ctx.release.title || "Untitled Release"}
			</h1>
			<div class="flex flex-wrap gap-2">
				<For each={ctx.release.artists || []}>
					{(artist) => (
						<span class="text-lg text-slate-600 hover:text-slate-800 cursor-pointer">
							{artist.name}
						</span>
					)}
				</For>
			</div>
		</div>
	)
}

function ReleaseInfoMetadata() {
	const ctx = assertContext(ReleaseInfoPageContext)
	
	return (
		<div class="flex flex-col gap-y-2 text-sm text-slate-600">
			<div>
				<Trans>Type:</Trans> {ctx.release.release_type}
			</div>
			<div>
				<Trans>Release Date:</Trans> {ctx.release.release_date}
			</div>
			<Show when={ctx.release.catalog_nums?.[0]?.catalog_number}>
				<div>
					<Trans>Catalog Number:</Trans> {ctx.release.catalog_nums?.[0]?.catalog_number}
				</div>
			</Show>
		</div>
	)
}

const TRIGGER_CLASS = "py-4"

function ReleaseInfoTabs() {
	const ctx = assertContext(ReleaseInfoPageContext)
	
	return (
		<Tab.Root>
			<Tab.List class="mx-4 grid-cols-3 gap-12 border-b border-slate-200">
				<Tab.Trigger
					value={"Details"}
					class={TRIGGER_CLASS}
				>
					<Trans>Details</Trans>
				</Tab.Trigger>
				<Tab.Trigger
					value={"Tracks"}
					class={TRIGGER_CLASS}
				>
					<Trans>Tracks</Trans>
				</Tab.Trigger>
				<Tab.Trigger
					value={"Credits"}
					class={TRIGGER_CLASS}
				>
					<Trans>Credits</Trans>
				</Tab.Trigger>
				<Tab.Indicator />
			</Tab.List>
			<Tab.Content value="Details">
				<ReleaseInfoDetails />
			</Tab.Content>
			<Tab.Content value="Tracks">
				<ReleaseInfoTracks />
			</Tab.Content>
			<Tab.Content value="Credits">
				<ReleaseInfoCredits />
			</Tab.Content>
		</Tab.Root>
	)
}

function ReleaseInfoDetails() {
	const ctx = assertContext(ReleaseInfoPageContext)
	
	return (
		<div class="p-6 space-y-6">
			<div class="grid grid-cols-1 md:grid-cols-2 gap-6">
				<div class="space-y-4">
					<h3 class="text-lg font-semibold border-b pb-2">
						<Trans>Release Information</Trans>
					</h3>
					<div class="space-y-2">
						<div class="flex justify-between">
							<span class="font-medium"><Trans>Type:</Trans></span>
							<span>{ctx.release.release_type}</span>
						</div>
						<div class="flex justify-between">
							<span class="font-medium"><Trans>Release Date:</Trans></span>
							<span>{ctx.release.release_date}</span>
						</div>
						<Show when={ctx.release.recording_date_start}>
							<div class="flex justify-between">
								<span class="font-medium"><Trans>Recording Start:</Trans></span>
								<span>{ctx.release.recording_date_start}</span>
							</div>
						</Show>
						<Show when={ctx.release.recording_date_end}>
							<div class="flex justify-between">
								<span class="font-medium"><Trans>Recording End:</Trans></span>
								<span>{ctx.release.recording_date_end}</span>
							</div>
						</Show>
					</div>
				</div>
				
				<div class="space-y-4">
					<h3 class="text-lg font-semibold border-b pb-2">
						<Trans>Catalog Information</Trans>
					</h3>
					<div class="space-y-2">
						<For each={ctx.release.catalog_nums || []}>
							{(catalog) => (
								<div class="flex justify-between">
									<span class="font-medium"><Trans>Catalog Number:</Trans></span>
									<span>{catalog.catalog_number}</span>
								</div>
							)}
						</For>
					</div>
				</div>
			</div>
			
			<Show when={(ctx.release.localized_titles?.length || 0) > 1}>
				<div class="space-y-4">
					<h3 class="text-lg font-semibold border-b pb-2">
						<Trans>Localized Titles</Trans>
					</h3>
					<div class="grid grid-cols-1 md:grid-cols-2 gap-4">
						<For each={ctx.release.localized_titles || []}>
							{(title) => (
								<div class="flex justify-between p-3 bg-slate-50 rounded-md">
									<span class="font-medium">{title.language?.name}:</span>
									<span>{title.title}</span>
								</div>
							)}
						</For>
					</div>
				</div>
			</Show>
		</div>
	)
}

function ReleaseInfoTracks() {
	const ctx = assertContext(ReleaseInfoPageContext)
	
	return (
		<div class="p-6">
			<h3 class="text-lg font-semibold mb-4">
				<Trans>Track Listing</Trans>
			</h3>
			<div class="space-y-2">
				<For each={ctx.release.tracks}>
					{(trackId, index) => (
						<div class="flex items-center p-3 bg-slate-50 rounded-md hover:bg-slate-100 transition-colors">
							<span class="w-8 text-center font-medium text-slate-600">
								{index() + 1}
							</span>
							<span class="flex-1 ml-4">
								Track {trackId} {/* In a real app, this would be fetched track info */}
							</span>
							<span class="text-slate-500 text-sm">
								3:24 {/* Placeholder duration */}
							</span>
						</div>
					)}
				</For>
			</div>
		</div>
	)
}

function ReleaseInfoCredits() {
	const ctx = assertContext(ReleaseInfoPageContext)
	
	// Group credits by role
	const groupedCredits = () => {
		const groups: Record<string, typeof ctx.release.credits> = {}
		for (const credit of ctx.release.credits || []) {
			const roleName = credit.role.name
			if (!groups[roleName]) {
				groups[roleName] = []
			}
			groups[roleName]!.push(credit)
		}
		return groups
	}
	
	return (
		
		<ul class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
			<CreditList
				credits={
					// This tab will hidden if credits is undefined or empty
					SongCreditStatics.groupByArtist(ctx.release.credits!).toSorted((a, b) =>
						a.artist.name.localeCompare(b.artist.name),
					)
				}
			/>
		</ul>
		// <div class="p-6">
		// 	<h3 class="text-lg font-semibold mb-4">
		// 		<Trans>Credits</Trans>
		// 	</h3>
		// 	<div class="space-y-6">
		// 		<For each={Object.entries(groupedCredits())}>
		// 			{([roleName, credits]) => (
		// 				<div class="space-y-2">
		// 					<h4 class="font-semibold text-slate-700 border-b pb-1">
		// 						{roleName}
		// 					</h4>
		// 					<div class="space-y-1">
		// 						<For each={credits}>
		// 							{(credit) => (
		// 								<div class="flex justify-between items-center p-2 bg-slate-50 rounded">
		// 									<span class="font-medium">{credit.artist.name}</span>
		// 									<span class="text-sm text-slate-600">
		// 										Tracks: {credit.on?.join(", ")}
		// 									</span>
		// 								</div>
		// 							)}
		// 						</For>
		// 					</div>
		// 				</div>
		// 			)}
		// 		</For>
		// 	</div>
		// </div>
	)
}