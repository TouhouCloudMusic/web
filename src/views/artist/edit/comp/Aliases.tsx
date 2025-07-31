import * as M from "@modular-forms/solid"
import { For } from "solid-js"
import { Cross1Icon } from "solid-radix-icons"

import type { Artist } from "~/api/artist"
import type { NewArtistCorrection } from "~/api/artist/schema"
import { Button } from "~/components/button"
import { FormComp } from "~/components/common/form"
import { InputField } from "~/components/common/form/Input"
import { Divider } from "~/components/divider"

import { ArtistSearchDialog } from "./ArtistSearchDialog"

type AliasesFieldArrayProps = {
	formStore: M.FormStore<NewArtistCorrection>
}

export function ArtistFormAliasesField(props: AliasesFieldArrayProps) {
	return (
		<M.FieldArray
			of={props.formStore}
			name="data.aliases"
		>
			{(fieldArray) => (
				<div class="w-96">
					<AliasesFieldLabel formStore={props.formStore} />
					<ul class="flex flex-col gap-2">
						<For each={fieldArray.items}>
							{(_, idx) => (
								<>
									<AliasListItem
										formStore={props.formStore}
										index={idx()}
										onRemove={() => {
											M.remove(props.formStore, "data.aliases", {
												at: idx(),
											})
										}}
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

type AliasesHeaderProps = {
	formStore: M.FormStore<NewArtistCorrection>
}

function AliasesFieldLabel(props: AliasesHeaderProps) {
	let handleSelect = (artist: Artist) => {
		const currentAliases = M.getValue(props.formStore, "data.aliases") ?? []
		if (!currentAliases.includes(artist.id)) {
			M.insert(props.formStore, "data.aliases", {
				value: artist.id,
			})
		}
	}
	return (
		<div class="mb-4 flex place-content-between items-center gap-4">
			<FormComp.Label class="m-0">Aliases</FormComp.Label>
			<div class="flex gap-2">
				<ArtistSearchDialog onSelect={handleSelect} />
			</div>
		</div>
	)
}

type AliasListItemProps = {
	formStore: M.FormStore<NewArtistCorrection>
	index: number
	onRemove: () => void
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
						<div>{field.value}</div>
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
