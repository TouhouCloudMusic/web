import { Trans, useLingui } from "@lingui-solid/solid/macro"
import * as M from "@modular-forms/solid"
import { useQuery } from "@tanstack/solid-query"
import * as R from "radash"
import { createSignal, For, createMemo, Suspense } from "solid-js"
import { Cross1Icon, PlusIcon } from "solid-radix-icons"

import type { SimpleArtist } from "~/api/artist"
import { ArtistQueryOption } from "~/api/artist"
import type { NewArtistCorrection } from "~/api/artist/schema"
import { Button } from "~/components/button"
import { FormComp } from "~/components/common/form"
import { InputField } from "~/components/common/form/Input"
import { SearchDialog } from "~/components/composite/form/SearchDialog"
import { Dialog } from "~/components/dialog"
import { Divider } from "~/components/divider"

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
	return (
		<div class="mb-4 flex place-content-between items-center gap-4">
			<FormComp.Label class="m-0">Aliases</FormComp.Label>
			<div class="flex gap-2">
				<ArtistSearchDialog formStore={props.formStore} />
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
		<li class="flex gap-2">
			<M.Field
				of={props.formStore}
				name={`data.aliases.${props.index}`}
			>
				{(field, fieldProps) => (
					<InputField.Root class="grow">
						<InputField.Input
							{...fieldProps}
							id={field.name}
							type="number"
							class="no-spinner"
							placeholder="Alias Artist ID"
							value={field.value}
						/>
						<InputField.Error message={field.error} />
					</InputField.Root>
				)}
			</M.Field>
			<Button
				variant="Tertiary"
				size="Sm"
				class="row-span-2 w-fit"
				onClick={props.onRemove}
			>
				<Cross1Icon />
			</Button>
		</li>
	)
}

type ArtistSearchDialogProps = {
	formStore: M.FormStore<NewArtistCorrection>
}

function ArtistSearchDialog(props: ArtistSearchDialogProps) {
	const { t } = useLingui()

	const [searchKeyword, setSearchKeyword] = createSignal("")

	const onInput = R.debounce(
		{
			delay: 200,
		},
		(e: Event) => {
			setSearchKeyword((e.target as HTMLInputElement).value)
		},
	)

	const searchTerm = createMemo(() => {
		const keyword = searchKeyword().trim()
		return keyword.length > 1 ? keyword : null
	})

	const artistsQuery = useQuery(() => ({
		...ArtistQueryOption.findByKeyword(searchTerm()!),
		keepPreviousData: true,
		enabled: searchTerm() !== null,
	}))

	const handleSelect = (artist: SimpleArtist) => {
		const currentAliases = M.getValue(props.formStore, "data.aliases") ?? []
		if (!currentAliases.includes(artist.id)) {
			M.insert(props.formStore, "data.aliases", {
				value: artist.id,
			})
		}
	}

	return (
		<SearchDialog.Root>
			<Dialog.Trigger
				as={Button}
				variant="Tertiary"
				class="h-max p-2"
			>
				<PlusIcon class="size-4 text-slate-600" />
			</Dialog.Trigger>

			<SearchDialog.Content>
				<div class="mb-6 space-y-4">
					<SearchDialog.Label>
						<Trans>Search Artist</Trans>
					</SearchDialog.Label>
					<SearchDialog.Input
						placeholder={t`Search...`}
						value={searchKeyword()}
						onInput={onInput}
						class="h-9 w-full"
					/>
				</div>

				<SearchDialog.List>
					<Suspense>
						<For each={artistsQuery.data}>
							{(artist) => (
								<li class="group relative border-slate-300 p-4 text-left transition-all duration-150 not-first:border-t last:border-b hover:bg-slate-50 active:bg-slate-100">
									<div class="absolute top-0 left-0 h-full w-px origin-left scale-y-0 transform-gpu bg-reimu-600 transition-all ease-in-out group-hover:scale-y-100"></div>
									<button
										type="button"
										class="w-full"
										onClick={() => handleSelect(artist)}
									>
										<div class="flex items-center justify-between">
											<div class="text-left text-lg font-light text-primary">
												{artist.name}
											</div>
											<div class="opacity-0 transition-opacity duration-150 group-hover:opacity-100">
												<PlusIcon class="size-4 text-tertiary" />
											</div>
										</div>
									</button>
								</li>
							)}
						</For>
					</Suspense>
				</SearchDialog.List>
			</SearchDialog.Content>
		</SearchDialog.Root>
	)
}
