import { Field, getInput, insert, remove, setInput } from "@formisch/solid"
import { Trans } from "@lingui-solid/solid/macro"
import type { ReleaseCredit } from "@thc/api"
import type { JSX } from "solid-js"
import { For } from "solid-js"
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
		setCredits(credits.length, { on: [] } as unknown as ReleaseCredit)
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

	const trackIndices = () => {
		const tracks = getInput(props.of, {
			path: ["data", "tracks"],
		}) as unknown[]
		const len = Array.isArray(tracks) ? tracks.length : 0
		return Array.from({ length: len }, (_, i) => i)
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
							<div class="grid grid-cols-2 gap-2">
								<div class="text-sm text-slate-700">
									{credit.artist ? (
										<ArtistInfo
											value={{ id: credit.artist.id, name: credit.artist.name }}
										/>
									) : (
										<span class="text-slate-400">Select artist</span>
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
							</div>

							<div class="grid grid-cols-2 gap-2">
								<div class="text-sm text-slate-700">
									{credit.role ? (
										<CreditRoleInfo
											value={{ id: credit.role.id, name: credit.role.name }}
										/>
									) : (
										<span class="text-slate-400">Select role</span>
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
							</div>

							<div class="flex flex-col gap-1">
								<FormComp.Label class="m-0">
									<Trans>On Tracks</Trans>
								</FormComp.Label>
								{/* TODO: this should get track names */}
								<For each={trackIndices()}>
									{(tIndex) => (
										<label class="flex items-center gap-2 text-sm">
											<input
												type="checkbox"
												checked={credit.on?.includes(tIndex) ?? false}
												onChange={(e) =>
													toggleCreditOnTrack(
														idx(),
														tIndex,
													)((e.target as HTMLInputElement).checked)
												}
											/>
											<span>Track #{tIndex + 1}</span>
										</label>
									)}
								</For>
							</div>

							<div class="flex justify-end">
								<Button
									variant="Tertiary"
									size="Sm"
									onClick={removeCreditRowAt(idx())}
								>
									<Cross1Icon />
								</Button>
							</div>
						</li>
					)}
				</For>
			</ul>
		</div>
	)
}
