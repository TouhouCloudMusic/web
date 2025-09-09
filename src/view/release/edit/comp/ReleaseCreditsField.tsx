import {
	Field,
	FieldArray,
	getInput,
	insert,
	remove,
	setInput,
} from "@formisch/solid"
import type { FormStore } from "@formisch/solid"
import { Trans } from "@lingui-solid/solid/macro"
import type { Artist } from "@thc/api"
import type { JSX } from "solid-js"
import { For } from "solid-js"
import { Cross1Icon, PlusIcon } from "solid-radix-icons"

import { Button } from "~/component/atomic/button"
import { FormComp } from "~/component/atomic/form"
import { InputField } from "~/component/atomic/form/Input"
import { NewReleaseCorrection as NewReleaseCorrectionSchema } from "~/domain/release"
import { ArtistSearchDialog } from "~/view/artist/edit/comp/ArtistSearchDialog"

import { CreditRoleSearchDialog } from "./CreditRoleSearchDialog"

type ReleaseFormStore = FormStore<typeof NewReleaseCorrectionSchema>

export function ReleaseCreditsField(props: {
	of: ReleaseFormStore
}): JSX.Element {
	return (
		<FieldArray
			of={props.of}
			path={["data", "credits"]}
		>
			{(fa) => (
				<div class="flex min-h-32 w-full flex-col">
					<div class="mb-4 flex place-content-between items-center gap-4">
						<FormComp.Label class="m-0">
							<Trans>Credits</Trans>
						</FormComp.Label>
						<Button
							variant="Tertiary"
							class="h-max p-2"
							onClick={() =>
								insert(props.of, {
									path: ["data", "credits"],
									initialInput: {
										artist_id: 0,
										role_id: 0,
										on: [],
									} as unknown as {
										artist_id: number
										role_id: number
										on?: number[]
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
										<Field
											of={props.of}
											path={["data", "credits", idx(), "artist_id"]}
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
														Artist ID: {field.input as number | undefined}
													</div>
												</>
											)}
										</Field>
										<ArtistSearchDialog
											onSelect={(artist: Artist) =>
												setInput(props.of, {
													path: ["data", "credits", idx(), "artist_id"],
													input: artist.id,
												})
											}
										/>
									</div>

									<div class="grid grid-cols-2 gap-2">
										<Field
											of={props.of}
											path={["data", "credits", idx(), "role_id"]}
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
														Role ID: {field.input as number | undefined}
													</div>
												</>
											)}
										</Field>
										<CreditRoleSearchDialog
											onSelect={(role) =>
												setInput(props.of, {
													path: ["data", "credits", idx(), "role_id"],
													input: role.id,
												})
											}
										/>
									</div>

									<FieldArray
										of={props.of}
										path={["data", "credits", idx(), "on"]}
									>
										{(onFa) => (
											<div class="flex flex-col gap-1">
												<FormComp.Label class="m-0">
													<Trans>On Tracks</Trans>
												</FormComp.Label>
												{/* 简单勾选当前 tracks 的索引 */}
												<For
													each={
														(getInput(props.of, {
															path: ["data", "tracks"],
														}) as unknown[]) ?? []
													}
												>
													{(_, tIdx) => (
														<label class="flex items-center gap-2 text-sm">
															<input
																type="checkbox"
																checked={
																	(
																		getInput(props.of, {
																			path: ["data", "credits", idx(), "on"],
																		}) as number[] | undefined
																	)?.includes(tIdx()) ?? false
																}
																onChange={(e) => {
																	const checked = (e.target as HTMLInputElement)
																		.checked
																	const current =
																		(getInput(props.of, {
																			path: ["data", "credits", idx(), "on"],
																		}) as number[] | undefined) ?? []
																	if (checked) {
																		setInput(props.of, {
																			path: ["data", "credits", idx(), "on"],
																			input: [...current, tIdx()],
																		})
																	} else {
																		setInput(props.of, {
																			path: ["data", "credits", idx(), "on"],
																			input: current.filter(
																				(x) => x !== tIdx(),
																			),
																		})
																	}
																}}
															/>
															<span>Track #{tIdx() + 1}</span>
														</label>
													)}
												</For>
											</div>
										)}
									</FieldArray>

									<div class="flex justify-end">
										<Button
											variant="Tertiary"
											size="Sm"
											onClick={() =>
												remove(props.of, {
													path: ["data", "credits"],
													at: idx(),
												})
											}
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
