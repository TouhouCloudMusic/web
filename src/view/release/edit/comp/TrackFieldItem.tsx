import { Field } from "@formisch/solid"
import { Trans } from "@lingui-solid/solid/macro"
import type { Artist, Song } from "@thc/api"
import { For } from "solid-js"
import { Cross1Icon, Pencil1Icon, Pencil2Icon } from "solid-radix-icons"

import { Button } from "~/component/atomic/button"
import { FormComp } from "~/component/atomic/form"
import { InputField } from "~/component/atomic/form/Input"
import { ArtistSearchDialog } from "~/component/form/SearchDialog"

import { SongSearchDialog } from "../comp/SongSearchDialog"
import { useReleaseFormContext } from "../context"
import { ArtistInfo, SongInfo } from "./EntityInfo"

export function TrackItem(props: { index: number }) {
	return (
		<>
			<div class="grid grid-cols-[minmax(0,1fr)_minmax(0,1fr)_auto] gap-2">
				<TrackNumInput index={props.index} />
				<DurationInput index={props.index} />
				<RemoveTrackButton index={props.index} />
			</div>
			<DisplayTitleInput index={props.index} />
			<TrackSongPicker index={props.index} />
			<TrackArtistsField trackIndex={props.index} />
		</>
	)
}

function TrackNumInput(props: { index: number }) {
	const ctx = useReleaseFormContext()
	return (
		<Field
			of={ctx.form}
			path={["data", "tracks", props.index, "track_number"]}
		>
			{(field) => (
				<InputField.Root>
					<InputField.Input
						{...field.props}
						placeholder="Track number"
						value={field.input ?? undefined}
					/>
					<InputField.Error>
						{field.errors ? field.errors[0] : undefined}
					</InputField.Error>
				</InputField.Root>
			)}
		</Field>
	)
}
function DisplayTitleInput(props: { index: number }) {
	const ctx = useReleaseFormContext()
	return (
		<Field
			of={ctx.form}
			path={["data", "tracks", props.index, "display_title"]}
		>
			{(field) => (
				<InputField.Root>
					<InputField.Input
						{...field.props}
						placeholder="Display title"
						value={field.input ?? undefined}
					/>
					<InputField.Error>
						{field.errors ? field.errors[0] : undefined}
					</InputField.Error>
				</InputField.Root>
			)}
		</Field>
	)
}

function DurationInput(props: { index: number }) {
	const ctx = useReleaseFormContext()

	return (
		<Field
			of={ctx.form}
			path={["data", "tracks", props.index, "duration"]}
		>
			{(field) => (
				<InputField.Root>
					<InputField.Input
						{...field.props}
						type="number"
						placeholder="Duration (ms)"
						value={field.input ?? undefined}
					/>
					<InputField.Error>
						{field.errors ? field.errors[0] : undefined}
					</InputField.Error>
				</InputField.Root>
			)}
		</Field>
	)
}

function TrackSongPicker(props: { index: number }) {
	const ctx = useReleaseFormContext()
	const songValue = () => ctx.trackSongs[props.index]

	return (
		<div class="grid grid-cols-[1fr_auto] items-center gap-2 pl-1">
			<Field
				of={ctx.form}
				path={["data", "tracks", props.index, "song_id"]}
			>
				{(field) => (
					<>
						<input
							{...field.props}
							type="number"
							hidden
							value={field.input ?? undefined}
						/>
						<div class="text-slate-700">
							{songValue() ? (
								<SongInfo value={songValue()!} />
							) : (
								<span class="text-slate-400">No song selected</span>
							)}
						</div>
					</>
				)}
			</Field>
			<SongSearchDialog
				onSelect={ctx.setTrackSong(props.index)}
				icon={<Pencil1Icon />}
			/>
		</div>
	)
}

function RemoveTrackButton(props: { index: number }) {
	const ctx = useReleaseFormContext()
	return (
		<Button
			variant="Tertiary"
			size="Sm"
			onClick={ctx.removeTrackAt(props.index)}
		>
			<Cross1Icon />
		</Button>
	)
}

function TrackArtistsField(props: { trackIndex: number }) {
	const store = useReleaseFormContext()
	const value = () => store.trackArtists[props.trackIndex] ?? []

	const trackArtistFilter = (artist: Artist) =>
		!value().some((a) => a.id === artist.id)

	const insertArtist = (artist: Artist) => {
		if (!trackArtistFilter(artist)) return
		store.addTrackArtist(props.trackIndex, artist)
	}
	const removeArtist = (idx: number) => () => {
		store.removeTrackArtistAt(props.trackIndex, idx)()
	}

	return (
		<div class="flex flex-col gap-2 pl-1">
			<div class="flex items-center justify-between gap-2">
				<FormComp.Label class="m-0">
					<Trans>Track Artists</Trans>
				</FormComp.Label>
				<ArtistSearchDialog
					onSelect={insertArtist}
					dataFilter={trackArtistFilter}
				/>
			</div>

			<ul class="flex flex-col gap-1">
				<For each={value()}>
					{(artist, idx) => (
						<li class="grid grid-cols-[1fr_auto] gap-2">
							<div class="text-sm text-slate-700">
								<ArtistInfo value={{ id: artist.id, name: artist.name }} />
							</div>
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
	)
}
