import * as Ark from "@ark-ui/solid"
import { insert } from "@modular-forms/solid"
import { For, Show } from "solid-js"

import { HStack, VStack } from "~/component/layout/index.tsx"
import { localizedLanguageArray } from "~/lib/form/schema/language.ts"
import { type IndexComponentProps } from "~/lib/type/solid-js/jsx.ts"
import { useController } from "../../context.tsx"
import * as Style from "../style.ts"
import { AddStringInputButton } from "./components/add_str_input_button.tsx"

export function LocalizedName() {
	const { FieldArray, formStore } = useController()

	return (
		<Ark.Fieldset.Root>
			<FieldArray name="localized_name">
				{(fieldArray) => (
					<>
						<div class="flex">
							<Ark.Fieldset.Legend class={Style.label}>
								Localized Name
							</Ark.Fieldset.Legend>
							<AddStringInputButton
								onClick={() =>
									insert(formStore, "localized_name", {
										// @ts-expect-error
										value: {
											name: "",
										},
									})
								}
								label="add localized name"
							/>
						</div>
						<ul class="h-12 w-24">
							<For each={fieldArray.items}>
								{(_, index) => <LoacalizedNameField index={index()} />}
							</For>
						</ul>
						<Show when={fieldArray.error}>
							<Ark.Fieldset.ErrorText>
								{fieldArray.error}
							</Ark.Fieldset.ErrorText>
						</Show>
					</>
				)}
			</FieldArray>
		</Ark.Fieldset.Root>
	)
}

function LoacalizedNameField(props: IndexComponentProps) {
	const { Field } = useController()
	return (
		<li class="flex h-fit flex-row">
			<Field name={`localized_name.${props.index}.name`}>
				{(field, props) => (
					<VStack>
						<input
							type="text"
							value={field.value}
							{...props}
						/>
						<Show when={field.error}>
							<span class="text-sm text-red-700">{field.error}</span>
						</Show>
					</VStack>
				)}
			</Field>

			<Field name={`localized_name.${props.index}.language`}>
				{(field, props) => (
					<VStack>
						<select
							{...props}
							required>
							<option></option>
							<For each={localizedLanguageArray}>
								{(item) => (
									<option
										value={item}
										selected={field.value === item}>
										{item}
									</option>
								)}
							</For>
						</select>
						<Show when={field.error}>
							<span class="text-sm text-red-700">{field.error}</span>
						</Show>
					</VStack>
				)}
			</Field>
		</li>
	)
}
