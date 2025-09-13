import { Field } from "@formisch/solid"
import type { Artist } from "@thc/api"
import { For } from "solid-js"
import { Cross1Icon } from "solid-radix-icons"
import { twMerge } from "tailwind-merge"

import { Button } from "~/component/atomic/button"
import { FormComp } from "~/component/atomic/form"
import { FieldArrayFallback } from "~/component/form/FieldArrayFallback"
import { ArtistSearchDialog } from "~/component/form/SearchDialog"

import { useReleaseFormContext } from "../context"
import { ArtistInfo } from "./EntityInfo"

export function ReleaseArtistsField(props: { class?: string }) {
	const ctx = useReleaseFormContext()
	const releaseArtistFilter = (artist: Artist) =>
		!ctx.artists.some((a) => a.id === artist.id)

	return (
		<div class={twMerge("flex min-h-32 flex-col", props.class)}>
			<div class="mb-4 flex place-content-between items-center gap-4">
				<FormComp.Label class="m-0">Artists</FormComp.Label>
				<div class="flex gap-2">
					<ArtistSearchDialog
						onSelect={ctx.addArtist}
						dataFilter={releaseArtistFilter}
					/>
				</div>
			</div>
			<ul class="flex h-full flex-col gap-2">
				<For
					each={ctx.artists}
					fallback={<FieldArrayFallback />}
				>
					{(artist, idx) => (
						<li class="grid h-fit grid-cols-[1fr_auto]">
							<div class="text-sm text-slate-700">
								<ArtistInfo value={{ id: artist.id, name: artist.name }} />
							</div>

							<Field
								of={ctx.form}
								path={["data", "artists", idx()]}
							>
								{(field) => (
									<>
										<input
											{...field.props}
											type="number"
											hidden
											value={field.input}
										/>
										<For each={field.errors}>
											{(error) => (
												<FormComp.ErrorMessage>{error}</FormComp.ErrorMessage>
											)}
										</For>
									</>
								)}
							</Field>
							<Button
								variant="Tertiary"
								size="Sm"
								onClick={ctx.removeArtistAt(idx())}
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
