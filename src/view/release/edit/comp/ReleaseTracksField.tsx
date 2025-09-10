import {
	Field,
	FieldArray,
	getInput,
	insert,
	remove,
	setInput,
} from "@formisch/solid"
import { Trans } from "@lingui-solid/solid/macro"
import type { Artist } from "@thc/api"
import { For, Show, createSignal } from "solid-js"
import { Cross1Icon, PlusIcon, Pencil1Icon } from "solid-radix-icons"
import { twMerge } from "tailwind-merge"

import { Button } from "~/component/atomic/button"
import { FormComp } from "~/component/atomic/form"
import { InputField } from "~/component/atomic/form/Input"
import { ArtistSearchDialog } from "~/component/form/SearchDialog"

import { SongSearchDialog } from "../comp/SongSearchDialog"
import { ArtistInfo, SongInfo } from "./EntityInfo"
import type { ReleaseFormStore } from "./types"

export function ReleaseTracksField(props: {
	of: ReleaseFormStore
	class?: string
}) {
	const [selectedDisc, setSelectedDisc] = createSignal(0)

	return (
		<FieldArray
			of={props.of}
			path={["data", "tracks"]}
		>
			{() => {
				const discs =
					(getInput(props.of, { path: ["data", "discs"] }) as
						| { name?: string }[]
						| undefined) ?? []
				if (discs.length === 0) {
					insert(props.of, {
						path: ["data", "discs"],
						initialInput: { name: "" } as unknown as { name?: string },
					})
				}

				const tracks =
					(getInput(props.of, { path: ["data", "tracks"] }) as
						| Array<{ disc_index: number }>
						| undefined) ?? []
				const visibleTrackIndices = tracks
					.map((t, i) => ({ t, i }))
					.filter(({ t }) => t.disc_index === selectedDisc())
					.map(({ i }) => i)

				return (
					<div class={twMerge("flex min-h-32 w-full flex-col", props.class)}>
						<TrackHeader
							of={props.of}
							selectedDisc={selectedDisc}
							setSelectedDisc={setSelectedDisc}
						/>
						<ul class="flex h-full flex-col gap-4">
							<For each={visibleTrackIndices}>
								{(realIndex) => (
									<li class="grid grid-cols-1 gap-2 rounded border border-slate-200 p-3">
										<TrackItem
											of={props.of}
											index={realIndex}
										/>
									</li>
								)}
							</For>
							<Show when={visibleTrackIndices.length === 0}>
								<li class="rounded border border-dashed border-slate-200 p-3 text-sm text-slate-500">
									<Trans>No tracks under this disc.</Trans>
								</li>
							</Show>
						</ul>
					</div>
				)
			}}
		</FieldArray>
	)
}

function TrackHeader(props: {
	of: ReleaseFormStore
	selectedDisc: () => number
	setSelectedDisc: (n: number) => void
}) {
	const onAddTrack = () =>
		insert(props.of, {
			path: ["data", "tracks"],
			initialInput: {
				disc_index: props.selectedDisc(),
				song_id: 0,
				artists: [],
				track_number: "",
				display_title: "",
				duration: undefined,
			},
		})

	const discs =
		(getInput(props.of, { path: ["data", "discs"] }) as
			| { name?: string }[]
			| undefined) ?? []
	const discCount = discs.length
	const currentDiscIdx = () => props.selectedDisc()
	const currentDiscName = () => {
		const d = discs[currentDiscIdx()]
		return d && d.name && d.name.trim().length > 0
			? d.name
			: `Disc ${currentDiscIdx() + 1}`
	}

	const onCycleDisc = () => {
		if (discCount === 0) return
		props.setSelectedDisc((currentDiscIdx() + 1) % discCount)
	}

	const onAddDisc = () => {
		const nextIndex = discCount
		insert(props.of, {
			path: ["data", "discs"],
			initialInput: { name: "" } as unknown as { name?: string },
		})
		props.setSelectedDisc(nextIndex)
	}

	const onEditDiscName = () => {
		const prev = (discs[currentDiscIdx()]?.name ?? ``).trim()
		const next = prompt("Disc name", prev)
		if (next === null) return
		setInput(props.of, {
			path: ["data", "discs", currentDiscIdx(), "name"],
			input: next,
		})
	}

	return (
		<div class="mb-4 flex flex-wrap items-center justify-between gap-3">
			<div class="flex items-center gap-2">
				<FormComp.Label class="m-0">
					<Trans>Tracks</Trans>
				</FormComp.Label>
				<button
					type="button"
					class="cursor-pointer rounded border border-slate-200 px-2 py-1 text-sm text-slate-700 select-none"
					title="Click to switch disc"
					onClick={onCycleDisc}
				>
					{currentDiscName()}
				</button>
				<Button
					variant="Tertiary"
					size="Sm"
					onClick={onEditDiscName}
					title="Rename disc"
				>
					<Pencil1Icon class="size-4" />
				</Button>
				<Button
					variant="Tertiary"
					size="Sm"
					onClick={onAddDisc}
					title="Add disc"
				>
					<PlusIcon class="size-4" />
				</Button>
			</div>
			<div>
				<Button
					variant="Tertiary"
					class="h-max p-2"
					onClick={onAddTrack}
					title="Add track"
				>
					<PlusIcon class="size-4" />
				</Button>
			</div>
		</div>
	)
}

function TrackItem(props: { of: ReleaseFormStore; index: number }) {
	return (
		<div class="grid grid-cols-1 gap-2">
			<TrackMetaFields
				of={props.of}
				index={props.index}
			/>
			<TrackDisplayFields
				of={props.of}
				index={props.index}
			/>
			<TrackSongPicker
				of={props.of}
				index={props.index}
			/>
			<TrackArtistsField
				of={props.of}
				trackIndex={props.index}
			/>
			<RemoveTrackButton
				of={props.of}
				index={props.index}
			/>
		</div>
	)
}

function TrackMetaFields(props: { of: ReleaseFormStore; index: number }) {
	return (
		<div class="grid grid-cols-1 gap-2">
			<Field
				of={props.of}
				path={["data", "tracks", props.index, "track_number"]}
			>
				{(field) => (
					<InputField.Root>
						<InputField.Input
							{...field.props}
							placeholder="Track number"
							value={field.input as string | undefined}
						/>
						<InputField.Error>
							{field.errors ? field.errors[0] : undefined}
						</InputField.Error>
					</InputField.Root>
				)}
			</Field>
		</div>
	)
}

function TrackDisplayFields(props: { of: ReleaseFormStore; index: number }) {
	return (
		<div class="grid grid-cols-2 gap-2">
			<Field
				of={props.of}
				path={["data", "tracks", props.index, "display_title"]}
			>
				{(field) => (
					<InputField.Root>
						<InputField.Input
							{...field.props}
							placeholder="Display title"
							value={field.input as string | undefined}
						/>
						<InputField.Error>
							{field.errors ? field.errors[0] : undefined}
						</InputField.Error>
					</InputField.Root>
				)}
			</Field>

			<Field
				of={props.of}
				path={["data", "tracks", props.index, "duration"]}
			>
				{(field) => (
					<InputField.Root>
						<InputField.Input
							{...field.props}
							type="number"
							placeholder="Duration (ms)"
							value={field.input as number | undefined}
						/>
						<InputField.Error>
							{field.errors ? field.errors[0] : undefined}
						</InputField.Error>
					</InputField.Root>
				)}
			</Field>
		</div>
	)
}

function TrackSongPicker(props: { of: ReleaseFormStore; index: number }) {
	return (
		<div class="flex items-center gap-2">
			<Field
				of={props.of}
				path={["data", "tracks", props.index, "song_id"]}
			>
				{(field) => (
					<>
						<input
							{...field.props}
							type="number"
							hidden
							value={field.input as number | undefined}
						/>
						<div class="text-sm text-slate-700">
							<SongInfo id={() => field.input as number | undefined} />
						</div>
					</>
				)}
			</Field>
			<SongSearchDialog
				onSelect={(song) =>
					setInput(props.of, {
						path: ["data", "tracks", props.index, "song_id"],
						input: song.id,
					})
				}
			/>
		</div>
	)
}

function RemoveTrackButton(props: { of: ReleaseFormStore; index: number }) {
	return (
		<div class="flex justify-end">
			<Button
				variant="Tertiary"
				size="Sm"
				onClick={() =>
					remove(props.of, { path: ["data", "tracks"], at: props.index })
				}
			>
				<Cross1Icon />
			</Button>
		</div>
	)
}

function TrackArtistsField(props: {
	of: ReleaseFormStore
	trackIndex: number
}) {
	const trackArtistFilter = (artist: Artist) => {
		const selected =
			(getInput(props.of, {
				path: ["data", "tracks", props.trackIndex, "artists"],
			}) as number[] | undefined) ?? []
		return !selected.includes(artist.id)
	}
	return (
		<FieldArray
			of={props.of}
			path={["data", "tracks", props.trackIndex, "artists"]}
		>
			{(fa) => (
				<div class="flex flex-col gap-2">
					<div class="flex items-center gap-2">
						<FormComp.Label class="m-0">
							<Trans>Track Artists</Trans>
						</FormComp.Label>
						<ArtistSearchDialog
							onSelect={(artist: Artist) =>
								insert(props.of, {
									path: ["data", "tracks", props.trackIndex, "artists"],
									initialInput: artist.id,
								})
							}
							dataFilter={trackArtistFilter}
						/>
					</div>

					<ul class="flex flex-col gap-1">
						<For each={fa.items}>
							{(_, idx) => (
								<li class="grid grid-cols-[1fr_auto] gap-2">
									<Field
										of={props.of}
										path={[
											"data",
											"tracks",
											props.trackIndex,
											"artists",
											idx(),
										]}
									>
										{(field) => (
											<>
												<input
													{...field.props}
													type="number"
													hidden
													value={field.input as number | undefined}
												/>
												<div class="text-sm text-slate-700">
													<ArtistInfo
														id={() => field.input as number | undefined}
													/>
												</div>
											</>
										)}
									</Field>
									<Button
										variant="Tertiary"
										size="Sm"
										onClick={() =>
											remove(props.of, {
												path: ["data", "tracks", props.trackIndex, "artists"],
												at: idx(),
											})
										}
									>
										<Cross1Icon />
									</Button>
								</li>
							)}
						</For>
					</ul>
				</div>
			)}
		</FieldArray>
	)
}
