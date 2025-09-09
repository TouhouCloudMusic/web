// 曲目字段（与页面内联实现对齐）
import { Field, FieldArray, insert, remove, setInput } from "@formisch/solid"
import { Trans } from "@lingui-solid/solid/macro"
import type { Artist } from "@thc/api"
import { For } from "solid-js"
import { Cross1Icon, PlusIcon } from "solid-radix-icons"

import { Button } from "~/component/atomic/button"
import { FormComp } from "~/component/atomic/form"
import { InputField } from "~/component/atomic/form/Input"
import { SongSearchDialog } from "../comp/SongSearchDialog"
import { ArtistSearchDialog } from "~/view/artist/edit/comp/ArtistSearchDialog"
import type { ReleaseFormStore } from "./types"

export function ReleaseTracksField(props: { of: ReleaseFormStore }) {
	return (
		<FieldArray of={props.of} path={["data", "tracks"]}>
			{(fa) => (
				<div class="flex min-h-32 w-full flex-col">
					<div class="mb-4 flex place-content-between items-center gap-4">
						<FormComp.Label class="m-0">
							<Trans>Tracks</Trans>
						</FormComp.Label>
						<Button
							variant="Tertiary"
							class="h-max p-2"
							onClick={() =>
								insert(props.of, {
									path: ["data", "tracks"],
									initialInput: {
										disc_index: 0,
										song_id: 0,
										artists: [],
										track_number: "",
										display_title: "",
										duration: undefined,
									} as unknown as {
										disc_index: number
										song_id: number
										artists: number[]
										track_number?: string
										display_title?: string
										duration?: number
									},
								})
							}
						>
							<PlusIcon class="size-4" />
						</Button>
					</div>
					<ul class="flex h-full flex-col gap-4">
						<For each={fa.items}>
							{(_, idx) => (
								<li class="grid grid-cols-1 gap-2 rounded border border-slate-200 p-3">
									<div class="grid grid-cols-2 gap-2">
										<Field of={props.of} path={["data", "tracks", idx(), "disc_index"]}>
											{(field) => (
												<InputField.Root>
													<InputField.Input
														{...field.props}
														type="number"
														placeholder="Disc index"
														value={field.input as number | undefined}
													/>
													<InputField.Error>
														{field.errors ? field.errors[0] : undefined}
													</InputField.Error>
												</InputField.Root>
											)}
										</Field>

										<Field of={props.of} path={["data", "tracks", idx(), "track_number"]}>
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

									<div class="grid grid-cols-2 gap-2">
										<Field of={props.of} path={["data", "tracks", idx(), "display_title"]}>
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

										<Field of={props.of} path={["data", "tracks", idx(), "duration"]}>
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

									<div class="flex items-center gap-2">
										<Field of={props.of} path={["data", "tracks", idx(), "song_id"]}>
											{(field) => (
												<>
													<input {...field.props} type="number" hidden value={field.input as number | undefined} />
													<div class="text-sm text-slate-700">
														Song ID: {field.input as number | undefined}
													</div>
												</>
											)}
										</Field>
										<SongSearchDialog
											onSelect={(song) =>
												setInput(props.of, {
													path: ["data", "tracks", idx(), "song_id"],
													input: song.id,
												})
											}
										/>
									</div>

									<TrackArtistsField of={props.of} trackIndex={idx()} />

									<div class="flex justify-end">
										<Button
											variant="Tertiary"
											size="Sm"
											onClick={() => remove(props.of, { path: ["data", "tracks"], at: idx() })}
										>
											<Cross1Icon />
										</Button>
									</div>
								</li>
							)}
						</For>
					</ul>
				</div>
			)}
		</FieldArray>
	)
}

function TrackArtistsField(props: { of: ReleaseFormStore; trackIndex: number }) {
	return (
		<FieldArray of={props.of} path={["data", "tracks", props.trackIndex, "artists"]}>
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
						/>
					</div>

					<ul class="flex flex-col gap-1">
						<For each={fa.items}>
							{(_, idx) => (
								<li class="grid grid-cols-[1fr_auto] gap-2">
									<Field
										of={props.of}
										path={["data", "tracks", props.trackIndex, "artists", idx()]}
									>
										{(field) => (
											<>
												<input {...field.props} type="number" hidden value={field.input as number | undefined} />
												<div class="text-sm text-slate-700">
													Artist ID: {field.input as number | undefined}
												</div>
											</>
										)}
									</Field>
									<Button
										variant="Tertiary"
										size="Sm"
										onClick={() =>
											remove(props.of, { path: ["data", "tracks", props.trackIndex, "artists"], at: idx() })
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
