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
import { For, Show, createMemo, createSignal } from "solid-js"
import {
	Cross1Icon,
	PlusIcon,
	Pencil1Icon,
	ArrowLeftIcon,
	ArrowRightIcon,
} from "solid-radix-icons"
import { twMerge } from "tailwind-merge"

import { Button } from "~/component/atomic/button"
import { FormComp } from "~/component/atomic/form"
import { InputField } from "~/component/atomic/form/Input"
import { Dialog } from "~/component/dialog"
import { FieldArrayFallback } from "~/component/form/FieldArrayFallback"
import { ArtistSearchDialog } from "~/component/form/SearchDialog"
import type { NewDisc } from "~/domain/release"

import { SongSearchDialog } from "../comp/SongSearchDialog"
import { ArtistInfo, SongInfo } from "./EntityInfo"
import type { ReleaseFormStore } from "./types"

export function ReleaseTracksField(props: {
	of: ReleaseFormStore
	class?: string
}) {
	const [selectedDisc, setSelectedDisc] = createSignal(0)

	return (
		<div class={props.class}>
			<TrackHeader
				of={props.of}
				selectedDisc={selectedDisc}
				setSelectedDisc={setSelectedDisc}
			/>
			<FieldArray
				of={props.of}
				path={["data", "tracks"]}
			>
				{(fa) => {
					const visibleTrackIndices = createMemo(() => {
						const items = fa.items
						return items
							.map((_, i) => i)
							.filter((i) => {
								const di = getInput(props.of, {
									path: ["data", "tracks", i, "disc_index"],
								})
								return di === selectedDisc()
							})
					})

					return (
						<ul class="flex h-full flex-col gap-4">
							<For each={visibleTrackIndices()}>
								{(trackIdx) => (
									<li class="grid grid-cols-1 gap-2 rounded border border-slate-400 p-3">
										<TrackItem
											of={props.of}
											index={trackIdx}
										/>
									</li>
								)}
							</For>
							<Show when={visibleTrackIndices().length === 0}>
								<li class="flex h-full items-center justify-center rounded text-secondary">
									<Trans>No tracks under this disc.</Trans>
								</li>
							</Show>
						</ul>
					)
				}}
			</FieldArray>
		</div>
	)
}

function TrackHeader(props: {
	of: ReleaseFormStore
	selectedDisc: () => number
	setSelectedDisc: (n: number) => void
}) {
	const discs = createMemo(() =>
		getInput(props.of, { path: ["data", "discs"] }),
	)
	const discCount = createMemo(() => discs().length)

	const onAddTrack = () => {
		if (discCount() === 0) {
			const initialDisc: NewDisc = { name: "" }
			insert(props.of, { path: ["data", "discs"], initialInput: initialDisc })
			props.setSelectedDisc(0)
		}
		insert(props.of, {
			path: ["data", "tracks"],
			initialInput: {
				disc_index: props.selectedDisc(),
			},
		})
	}

	const currentDiscIdx = props.selectedDisc
	const currentDiscName = createMemo(() => {
		const d = discs()[currentDiscIdx()]
		if (d && d.name && d.name.length > 0) return d.name
		return `Disc ${currentDiscIdx() + 1}`
	})

	const onPrevDisc = () => {
		if (discCount() === 0) return
		props.setSelectedDisc((currentDiscIdx() - 1 + discCount()) % discCount())
	}

	const onNextDisc = () => {
		if (discCount() === 0) return
		props.setSelectedDisc((currentDiscIdx() + 1) % discCount())
	}

	const onAddDisc = () => {
		const nextIndex = discCount()
		const initial: NewDisc = { name: "" }
		insert(props.of, { path: ["data", "discs"], initialInput: initial })
		props.setSelectedDisc(nextIndex)
	}

	const onConfirmRename = (next: string) => {
		setInput(props.of, {
			path: ["data", "discs", currentDiscIdx(), "name"],
			input: next,
		})
	}

	return (
		<div class="mb-4 flex flex-col gap-2">
			<div class="flex items-center justify-between">
				<FormComp.Label class="m-0">
					<Trans>Tracks</Trans>
				</FormComp.Label>
				<Button
					variant="Tertiary"
					class="h-max p-2"
					onClick={onAddTrack}
					title="Add track"
				>
					<PlusIcon class="size-4" />
				</Button>
			</div>
			<div class="flex items-center justify-between gap-2">
				<Button
					variant="Tertiary"
					class="h-max p-2"
					onClick={onPrevDisc}
					title="Previous disc"
				>
					<ArrowLeftIcon class="size-4" />
				</Button>
				<div class="flex items-center gap-2">
					<div class="rounded px-2 leading-none text-primary">
						{currentDiscName()}
					</div>
					<EditDiscNameDialog
						currentName={currentDiscName}
						onConfirm={onConfirmRename}
					/>
					<Button
						variant="Tertiary"
						size="Sm"
						onClick={onAddDisc}
						class="p-2"
						title="Add disc"
					>
						<PlusIcon class="size-4" />
					</Button>
				</div>
				<Button
					variant="Tertiary"
					class="p-2"
					onClick={onNextDisc}
					title="Next disc"
				>
					<ArrowRightIcon class="size-4" />
				</Button>
			</div>
		</div>
	)
}

type DiscNameDialogProps = {
	currentName: () => string
	onConfirm: (name: string) => void
}

function EditDiscNameDialog(props: DiscNameDialogProps) {
	let [open, setOpen] = createSignal(false)
	let [name, setName] = createSignal("")

	let syncOpen = (state: boolean) => {
		setOpen(state)
		if (state) {
			let initial = props.currentName().trim()
			setName(initial)
		}
	}

	let onInput = (e: Event) => {
		let value = (e.target as HTMLInputElement).value
		setName(value)
	}

	let confirm = () => {
		let next = name().trim()
		props.onConfirm(next)
		setOpen(false)
	}

	return (
		<Dialog.Root
			open={open()}
			onOpenChange={syncOpen}
		>
			<Dialog.Trigger
				as={Button}
				variant="Tertiary"
				class="h-full p-2"
				size="Sm"
				title="Rename disc"
			>
				<Pencil1Icon class="size-4" />
			</Dialog.Trigger>
			<Dialog.Portal>
				<Dialog.Overlay />
				<Dialog.Content class="w-full max-w-sm rounded p-4">
					<Dialog.Title class="text-lg">Rename Disc</Dialog.Title>
					<div class="mt-4 space-y-2">
						<InputField.Root>
							<InputField.Input
								placeholder="Disc name"
								value={name()}
								onInput={onInput}
							/>
						</InputField.Root>
					</div>
					<div class="mt-4 flex justify-end gap-2">
						<Dialog.CloseButton variant="Tertiary">Cancel</Dialog.CloseButton>
						<Button
							variant="Primary"
							color="Reimu"
							onClick={confirm}
						>
							Confirm
						</Button>
					</div>
				</Dialog.Content>
			</Dialog.Portal>
		</Dialog.Root>
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

	const insertArtist = (artist: Artist) =>
		insert(props.of, {
			path: ["data", "tracks", props.trackIndex, "artists"],
			initialInput: artist.id,
		})

	const removeArtist = (idx: number) => () =>
		remove(props.of, {
			path: ["data", "tracks", props.trackIndex, "artists"],
			at: idx,
		})

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
							onSelect={insertArtist}
							dataFilter={trackArtistFilter}
						/>
					</div>

					<ul class="flex flex-col gap-1">
						<For
							each={fa.items}
							fallback={<FieldArrayFallback />}
						>
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
													value={field.input}
												/>
												<div class="text-sm text-slate-700">
													<ArtistInfo id={() => field.input} />
												</div>
											</>
										)}
									</Field>
									<Button
										variant="Tertiary"
										size="Sm"
										onClick={removeArtist(idx())}
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
