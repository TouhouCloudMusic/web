// 发行艺人字段
import { Field, FieldArray, getInput, insert, remove } from "@formisch/solid"
import { Trans } from "@lingui-solid/solid/macro"
import type { Artist } from "@thc/api"
import { For } from "solid-js"
import { Cross1Icon } from "solid-radix-icons"
import { twMerge } from "tailwind-merge"

import { Button } from "~/component/atomic/button"
import { FormComp } from "~/component/atomic/form"
import { ArtistSearchDialog } from "~/component/form/SearchDialog"

import { ArtistInfo } from "./EntityInfo"
import type { ReleaseFormStore } from "./types"

export function ReleaseArtistsField(props: {
	of: ReleaseFormStore
	class?: string
}) {
	const releaseArtistFilter = (artist: Artist) => {
		const selected =
			(getInput(props.of, { path: ["data", "artists"] }) as
				| number[]
				| undefined) ?? []
		return !selected.includes(artist.id)
	}
	return (
		<FieldArray
			of={props.of}
			path={["data", "artists"]}
		>
			{(fa) => (
				<div class={twMerge("flex min-h-32 w-96 flex-col", props.class)}>
					<div class="mb-4 flex place-content-between items-center gap-4">
						<FormComp.Label class="m-0">
							<Trans>Artists</Trans>
						</FormComp.Label>
						<div class="flex gap-2">
							<ArtistSearchDialog
								onSelect={(artist: Artist) =>
									insert(props.of, {
										path: ["data", "artists"],
										initialInput: artist.id,
									})
								}
								dataFilter={releaseArtistFilter}
							/>
						</div>
					</div>
					<ul class="flex h-full flex-col gap-2">
						<For each={fa.items}>
							{(_, idx) => (
								<li class="grid h-fit grid-cols-[1fr_auto]">
									<Field
										of={props.of}
										path={["data", "artists", idx()]}
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
											remove(props.of, { path: ["data", "artists"], at: idx() })
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
