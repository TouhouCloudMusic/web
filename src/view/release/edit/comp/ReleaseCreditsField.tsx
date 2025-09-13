import { Field } from "@formisch/solid"
import { Trans } from "@lingui-solid/solid/macro"
import type { JSX } from "solid-js"
import { For } from "solid-js"
import { Cross1Icon, PlusIcon } from "solid-radix-icons"
import { twMerge } from "tailwind-merge"

import { Button } from "~/component/atomic/button"
import { FormComp } from "~/component/atomic/form"
import { FieldArrayFallback } from "~/component/form/FieldArrayFallback"
import {
	ArtistSearchDialog,
	CreditRoleSearchDialog,
} from "~/component/form/SearchDialog"

import { useReleaseFormContext } from "../context"
import { ArtistInfo, CreditRoleInfo } from "./EntityInfo"

export function ReleaseCreditsField(props: { class?: string }): JSX.Element {
	const store = useReleaseFormContext()

	return (
		<div class={twMerge("flex min-h-32 w-full flex-col", props.class)}>
			<div class="mb-4 flex place-content-between items-center gap-4">
				<FormComp.Label class="m-0">
					<Trans>Credits</Trans>
				</FormComp.Label>
				<Button
					variant="Tertiary"
					class="h-max p-2"
					onClick={store.addCreditRow}
				>
					<PlusIcon class="size-4" />
				</Button>
			</div>
			<ul class="flex h-full flex-col gap-4">
				<For
					each={store.credits}
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
									of={store.form}
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

								<ArtistSearchDialog onSelect={store.setCreditArtist(idx())} />
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
									of={store.form}
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
								<CreditRoleSearchDialog onSelect={store.setCreditRole(idx())} />
							</div>

							<div class="flex flex-col gap-1">
								<FormComp.Label class="m-0">
									<Trans>On Tracks</Trans>
								</FormComp.Label>
								<For each={store.trackSongs}>
									{(_, tIdx) => (
										<label class="flex items-center gap-2 text-sm">
											<input
												type="checkbox"
												checked={credit.on?.includes(tIdx()) ?? false}
												onChange={(e) =>
													store.toggleCreditOnTrack(
														idx(),
														tIdx(),
													)((e.target as HTMLInputElement).checked)
												}
											/>
											<span>Track #{tIdx() + 1}</span>
										</label>
									)}
								</For>
							</div>

							<div class="flex justify-end">
								<Button
									variant="Tertiary"
									size="Sm"
									onClick={store.removeCreditRowAt(idx())}
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
