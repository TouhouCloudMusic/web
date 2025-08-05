import * as M from "@modular-forms/solid"
import { For } from "solid-js"
import { Cross1Icon, PlusIcon } from "solid-radix-icons"

import type { NewArtistCorrection } from "~/api/artist/schema"
import { Button } from "~/components/button"
import { FormComp } from "~/components/common/form"
import { InputField } from "~/components/common/form/Input"
import { Divider } from "~/components/divider"

import { FieldArrayFallback } from "./FieldArrayFallback"

type TextAliasesFieldArrayProps = {
	formStore: M.FormStore<NewArtistCorrection>
}

export function ArtistFormTextAliases(props: TextAliasesFieldArrayProps) {
	return (
		<M.FieldArray
			of={props.formStore}
			name="data.text_aliases"
		>
			{(fieldArray) => (
				<div class="flex min-h-32 w-96 flex-col">
					<div class="mb-4 flex place-content-between items-center gap-4">
						<FormComp.Label class="m-0">Text Aliases</FormComp.Label>
						<Button
							variant="Tertiary"
							class="h-max p-2"
							onClick={() => {
								M.insert(props.formStore, "data.text_aliases", {
									value: "", // Default for new text alias
								})
							}}
						>
							<PlusIcon class="size-4" />
						</Button>
					</div>
					<ul class="flex h-full flex-col gap-2">
						<For
							each={fieldArray.items}
							fallback={<FieldArrayFallback />}
						>
							{(_, idx) => (
								<>
									<li class="flex gap-2">
										<M.Field
											of={props.formStore}
											name={`data.text_aliases.${idx()}`}
										>
											{(field, fieldProps) => (
												<InputField.Root class="grow">
													<InputField.Input
														{...fieldProps}
														id={field.name}
														placeholder="Name"
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
											onClick={() => {
												M.remove(props.formStore, "data.text_aliases", {
													at: idx(),
												})
											}}
										>
											<Cross1Icon />
										</Button>
									</li>
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
