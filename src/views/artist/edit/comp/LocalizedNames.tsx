import * as M from "@modular-forms/solid"
import { For } from "solid-js"
import { Cross1Icon, PlusIcon } from "solid-radix-icons"

import type { NewArtistCorrection } from "~/api/artist/schema"
import { Button } from "~/components/button"
import { FormComp } from "~/components/common/form"
import { InputField } from "~/components/common/form/Input"
import { Divider } from "~/components/divider"

type LocalizedNamesFieldArrayProps = {
	formStore: M.FormStore<NewArtistCorrection>
}

export function LocalizedNamesFieldArray(props: LocalizedNamesFieldArrayProps) {
	return (
		<M.FieldArray
			of={props.formStore}
			name="data.localized_names"
		>
			{(fieldArray) => (
				<div class="w-96">
					<div class="mb-4 flex place-content-between items-center gap-4">
						<FormComp.Label class="m-0">Localized Names</FormComp.Label>
						<Button
							variant="Tertiary"
							class="h-max p-2"
							onClick={() => {
								M.insert(props.formStore, "data.localized_names", {
									// @ts-expect-error
									value: { language_id: undefined, name: "" }, // Default value
								})
							}}
						>
							<PlusIcon class="size-4" />
						</Button>
					</div>
					<ul class="flex flex-col gap-2">
						<For each={fieldArray.items}>
							{(_, idx) => (
								<li class="grid grid-cols-[1fr_auto] grid-rows-2 gap-2">
									<M.Field
										of={props.formStore}
										name={`data.localized_names.${idx()}.language_id`}
										type="number"
									>
										{(field, fieldProps) => (
											<InputField.Root>
												<InputField.Input
													{...fieldProps}
													id={field.name}
													placeholder="Language ID"
													value={field.value}
												/>
												<InputField.Error message={field.error} />
											</InputField.Root>
										)}
									</M.Field>
									<M.Field
										of={props.formStore}
										name={`data.localized_names.${idx()}.name`}
									>
										{(field, fieldProps) => (
											<InputField.Root class="row-start-2">
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
											M.remove(props.formStore, "data.localized_names", {
												at: idx(),
											})
										}}
									>
										<Cross1Icon />
									</Button>

									{idx() < fieldArray.items.length - 1 && <Divider horizonal />}
								</li>
							)}
						</For>
					</ul>
				</div>
			)}
		</M.FieldArray>
	)
}
