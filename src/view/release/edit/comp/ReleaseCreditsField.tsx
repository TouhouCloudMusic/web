import { Field, getInput, insert, remove, setInput } from "@formisch/solid"
import { Trans } from "@lingui-solid/solid/macro"
import type { ReleaseCredit } from "@thc/api"
import type { JSX } from "solid-js"
import { createMemo, For } from "solid-js"
import { createStore } from "solid-js/store"
import { Cross1Icon, PlusIcon } from "solid-radix-icons"
import { twMerge } from "tailwind-merge"

import { Button } from "~/component/atomic/button"
import { FormComp } from "~/component/atomic/form"
import { FieldArrayFallback } from "~/component/form/FieldArrayFallback"
import {
	ArtistSearchDialog,
	CreditRoleSearchDialog,
} from "~/component/form/SearchDialog"

import { ArtistInfo, CreditRoleInfo } from "./EntityInfo"
import type { ReleaseFormStore } from "./types"

export function ReleaseCreditsField(props: {
	of: ReleaseFormStore
	initCredits?: ReleaseCredit[]
	class?: string
}): JSX.Element {
	const [credits, setCredits] = createStore<ReleaseCredit[]>([
		...(props.initCredits ?? []),
	])

	const addCreditRow = () => {
		insert(props.of, { path: ["data", "credits"], initialInput: {} })
		setCredits(credits.length, { on: [] })
	}

	const removeCreditRowAt = (idx: number) => () => {
		remove(props.of, { path: ["data", "credits"], at: idx })
		setCredits((list) => list.toSpliced(idx, 1))
	}

	const setCreditArtistAt =
		(idx: number) => (a: { id: number; name: string }) => {
			setCredits(idx, (row) => ({ ...(row ?? { on: [] }), artist: a }))
			setInput(props.of, {
				path: ["data", "credits", idx, "artist_id"],
				input: a.id,
			})
		}

	const setCreditRoleAt =
		(idx: number) => (r: { id: number; name: string }) => {
			setCredits(idx, (row) => ({ ...(row ?? { on: [] }), role: r }))
			setInput(props.of, {
				path: ["data", "credits", idx, "role_id"],
				input: r.id,
			})
		}

	const toggleCreditOnTrack =
		(rowIdx: number, trackIdx: number) => (checked: boolean) => {
			const curr = credits[rowIdx]?.on ?? []
			const on = checked
				? [...curr, trackIdx]
				: curr.filter((x) => x !== trackIdx)
			setCredits(rowIdx, (row) => ({ ...(row ?? { on: [] }), on }))
			setInput(props.of, {
				path: ["data", "credits", rowIdx, "on"],
				input: on,
			})
		}

	let trackValues = createMemo(() =>
		getInput(props.of, { path: ["data", "tracks"] }),
	)

	const sortedTrackIndices = createMemo(() => {
		const tracks = trackValues()
		const counters = new Map<number, number>()
		const within = tracks.map((t) => {
			const discIdx = t?.disc_index ?? 0
			const currIdx = counters.get(discIdx) ?? 0
			counters.set(discIdx, currIdx + 1)
			return currIdx + 1
		})
		return tracks
			.map((_, i) => i)
			.toSorted((a, b) => {
				const da = tracks[a]?.disc_index ?? 0
				const db = tracks[b]?.disc_index ?? 0
				if (da !== db) return da - db
				return within[a]! - within[b]!
			})
	})

	const renderTrackLabel = (tIndex: number) => {
		const tracks = trackValues()
		const discIndex = tracks[tIndex]?.disc_index ?? 0
		let withinDisc = 0
		for (let i = 0; i <= tIndex; i += 1) {
			if (tracks[i]?.disc_index === discIndex) withinDisc += 1
		}
		return `Disc ${discIndex + 1} Track ${withinDisc}`
	}

	return (
		<div class={twMerge("flex min-h-32 w-full flex-col", props.class)}>
			<div class="mb-4 flex place-content-between items-center gap-4">
				<FormComp.Label class="m-0">
					<Trans>Credits</Trans>
				</FormComp.Label>
				<Button
					variant="Tertiary"
					class="h-max p-2"
					onClick={addCreditRow}
				>
					<PlusIcon class="size-4" />
				</Button>
			</div>
			<ul class="flex h-full flex-col gap-4">
				<For
					each={credits}
					fallback={<FieldArrayFallback />}
				>
					{(credit, idx) => (
						<li class="grid grid-cols-1 gap-2 rounded border border-slate-200 p-3">
							<div class="grid grid-cols-[1fr_auto_1fr_auto_auto] items-center gap-2">
								<div class="text-sm text-slate-700">
									{credit.artist ? (
										<ArtistInfo
											value={{ id: credit.artist.id, name: credit.artist.name }}
										/>
									) : (
										<span class="text-tertiary">Select artist</span>
									)}
								</div>
								<Field
									of={props.of}
									path={["data", "credits", idx(), "artist_id"]}
								>
									{(field) => (
										<input
											{...field.props}
											type="number"
											hidden
											value={field.input ?? undefined}
										/>
									)}
								</Field>

								<ArtistSearchDialog onSelect={setCreditArtistAt(idx())} />

								<div class="text-sm text-slate-700">
									{credit.role ? (
										<CreditRoleInfo
											value={{ id: credit.role.id, name: credit.role.name }}
										/>
									) : (
										<span class="text-tertiary">Select role</span>
									)}
								</div>
								{/* Hidden field for role_id */}
								<Field
									of={props.of}
									path={["data", "credits", idx(), "role_id"]}
								>
									{(field) => (
										<input
											{...field.props}
											type="number"
											hidden
											value={field.input ?? undefined}
										/>
									)}
								</Field>
								<CreditRoleSearchDialog onSelect={setCreditRoleAt(idx())} />

								<Button
									variant="Tertiary"
									size="Sm"
									class="h-full p-2"
									onClick={removeCreditRowAt(idx())}
								>
									<Cross1Icon />
								</Button>
							</div>

							<div class="flex flex-col gap-1">
								<FormComp.Label>
									<Trans>On Tracks</Trans>
								</FormComp.Label>
								{/* TODO: this should get track names */}
								<For each={sortedTrackIndices()}>
									{(tIndex) => (
										<Field
											of={props.of}
											path={["data", "credits", idx(), "on"]}
										>
											{(field) => (
												<label class="flex items-center gap-2 text-sm">
													<input
														{...field.props}
														type="checkbox"
														onChange={(e) => {
															field.props.onChange(e)
															toggleCreditOnTrack(
																idx(),
																tIndex,
															)(e.target.checked)
														}}
													/>
													<span>{renderTrackLabel(tIndex)}</span>
												</label>
											)}
										</Field>
									)}
								</For>
							</div>
						</li>
					)}
				</For>
			</ul>
		</div>
	)
}
