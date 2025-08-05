import * as M from "@modular-forms/solid"
import { For } from "solid-js"
import { createStore, produce } from "solid-js/store"
import { Cross1Icon } from "solid-radix-icons"

import type { Artist } from "~/api/artist"
import type { NewArtistCorrection } from "~/api/artist/schema"
import { Button } from "~/components/button"
import { FormComp } from "~/components/common/form"
import { Divider } from "~/components/divider"

import { ArtistSearchDialog } from "./ArtistSearchDialog"
import { FieldArrayFallback } from "./FieldArrayFallback"

type AliasesFieldArrayProps = {
	formStore: M.FormStore<NewArtistCorrection>
}

export function ArtistFormAliasesField(props: AliasesFieldArrayProps) {
	let [aliasStore, setAliasStore] = createStore({
		items: [] as Artist[],
	})

	let handleSelect = (artist: Artist) => {
		const currentAliases = M.getValues(props.formStore, "data.aliases", {
			shouldActive: false,
		})

		if (!currentAliases.includes(artist.id)) {
			setAliasStore(
				produce((s) => {
					s.items.push(artist)
				}),
			)
			M.insert(props.formStore, "data.aliases", {
				value: artist.id,
			})
		}
	}

	let handleRemove = (idx: number) => {
		setAliasStore(
			produce((s) => {
				s.items.splice(idx, 1)
			}),
		)
		M.remove(props.formStore, "data.aliases", {
			at: idx,
		})
	}

	return (
		<M.FieldArray
			of={props.formStore}
			name="data.aliases"
		>
			{(fieldArray) => (
				<div class="flex min-h-32 w-96 flex-col">
					<div class="mb-4 flex place-content-between items-center gap-4">
						<FormComp.Label class="m-0">Aliases</FormComp.Label>
						<div class="flex gap-2">
							<ArtistSearchDialog onSelect={handleSelect} />
						</div>
					</div>
					<ul class="flex h-full flex-col gap-2">
						<For
							each={fieldArray.items}
							fallback={<FieldArrayFallback />}
						>
							{(_, idx) => (
								<>
									<AliasListItem
										formStore={props.formStore}
										index={idx()}
										onRemove={() => handleRemove(idx())}
										artist={aliasStore.items[idx()]!}
									/>
									{idx() < fieldArray.items.length - 1 && <Divider horizonal />}
								</>
							)}
						</For>
					</ul>
				</div>
			)}
		</M.FieldArray>
	)
}

type AliasListItemProps = {
	formStore: M.FormStore<NewArtistCorrection>
	index: number
	onRemove: () => void
	artist: Artist
}

function AliasListItem(props: AliasListItemProps) {
	return (
		<li class="grid h-fit grid-cols-[1fr_auto]">
			<M.Field
				of={props.formStore}
				name={`data.aliases.${props.index}`}
			>
				{(field, fieldProps) => (
					<>
						<input
							{...fieldProps}
							type="number"
							hidden
							value={field.value}
						/>
						<div>{props.artist.name}</div>
					</>
				)}
			</M.Field>

			<Button
				variant="Tertiary"
				size="Sm"
				class=""
				onClick={props.onRemove}
			>
				<Cross1Icon />
			</Button>
		</li>
	)
}
