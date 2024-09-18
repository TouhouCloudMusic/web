import { Fieldset } from "@ark-ui/solid"
import { Combobox } from "@kobalte/core/combobox"
import {
	Dialog,
	type DialogTriggerOptions,
	type DialogTriggerRenderProps,
} from "@kobalte/core/dialog"
import { type PolymorphicCallbackProps } from "@kobalte/core/polymorphic"
import { insert, remove, reset, setValue } from "@modular-forms/solid"
import { type lang } from "@touhouclouddb/database/interfaces"
import { For } from "solid-js"
import {
	CaretSortIcon,
	Cross1Icon,
	PlusIcon,
	ResetIcon,
} from "solid-radix-icons"
import { stringSimilarity } from "string-similarity-js"
import { twMerge } from "tailwind-merge"
import {
	type ButtonProps,
	PrimaryButton,
	SecondaryButton,
	TertiaryButton,
} from "~/component/button/index.tsx"
import { Combobox as ComboboxStyle } from "~/component/combobox.tsx"
import { TextField } from "~/component/form/index.tsx"
import { ArrowPathIcon } from "~/component/icons/heroicons/24/outline.tsx"
import { Card } from "~/component/layout/index.tsx"
import { localizedLanguageArray } from "~/lib/form/schema/language.ts"
import { type IndexComponentProps } from "~/lib/type/solid-js/jsx.ts"
import { useController } from "../context.tsx"

const fieldLayoutClass = "row-span-2 grid grid-rows-subgrid"

export function LocalizedName() {
	const { FieldArray, formStore } = useController()

	const insertItem = () =>
		insert(formStore, "localized_name", {
			// @ts-expect-error
			value: {},
		})

	const removeItem = (index: number) => {
		remove(formStore, "localized_name", {
			at: index,
		})
	}

	return (
		<FieldArray
			name="localized_name"
			revalidateOn="blur">
			{(fieldArray) => (
				// Label
				<Fieldset.Root
					name={fieldArray.name}
					invalid={fieldArray.error.length > 0}
					class="flex flex-col">
					<div class="flex items-end justify-between [&_svg]:size-[15px]">
						<Fieldset.Legend class={TextField.Label.className}>
							Localized Name
						</Fieldset.Legend>
						<div>
							<ResetFieldDialogTrigger />
							<TertiaryButton
								size="xs"
								onClick={insertItem}
								class="mr-0.5 aspect-square h-full p-1.5"
								aria-label={`Insert new item to ${fieldArray.name.replace("_", " ")}`}>
								<PlusIcon />
							</TertiaryButton>
						</div>
					</div>

					<ul class="bg-secondary [&_li]:bg-primary mt-2 flex min-h-32 flex-col gap-2 rounded-md p-2">
						<For
							each={fieldArray.items}
							fallback={
								<span class="m-auto text-slate-600">
									Click "+" to add Input
								</span>
							}>
							{(_, index) => (
								<li class="grid grid-cols-[1fr_auto_auto] gap-x-2 rounded-md p-2">
									<NameField index={index()} />
									<LanguageField index={index()} />
									<TertiaryButton
										class="aspect-square p-0"
										onClick={() => removeItem(index())}
										aria-label={`remove localized name at ${index()}`}>
										<Cross1Icon class="m-auto" />
									</TertiaryButton>
								</li>
							)}
						</For>
					</ul>
					<Fieldset.ErrorText>{fieldArray.error}</Fieldset.ErrorText>
				</Fieldset.Root>
			)}
		</FieldArray>
	)
}

function ResetFieldDialogTrigger() {
	const { formStore } = useController()

	const resetField = () => {
		reset(formStore, "localized_name")
	}

	return (
		<Dialog>
			<Dialog.Trigger
				size="xs"
				class="mr-0.5 aspect-square h-full p-1.5"
				aria-label="Reset localized name field to initial state"
				as={TertiaryButton}>
				<ArrowPathIcon />
			</Dialog.Trigger>
			<Dialog.Portal>
				<Dialog.Overlay class="bg-slate-1000/5 fixed inset-0 z-50 flex place-content-center" />
				<div class="fixed inset-0 z-50 flex place-content-center">
					<Dialog.Content class="bg-primary z-50 m-auto grid h-fit grid-cols-3 gap-x-2 gap-y-6 rounded-md p-4 shadow-md shadow-gray-300">
						<Dialog.Title class="col-span-full font-medium">
							Reset field?
						</Dialog.Title>
						<div class="col-span-2 col-start-2 grid grid-cols-subgrid">
							<Dialog.CloseButton
								class="shadow-sm shadow-slate-200"
								color="warning"
								size="sm"
								onClick={resetField}
								as={SecondaryButton}>
								Reset
							</Dialog.CloseButton>
							<Dialog.CloseButton
								class=""
								size="sm"
								as={PrimaryButton}>
								No
							</Dialog.CloseButton>
						</div>
					</Dialog.Content>
				</div>
			</Dialog.Portal>
		</Dialog>
	)
}

function NameField(props: IndexComponentProps) {
	const { Field } = useController()
	return (
		<Field name={`localized_name.${props.index}.name`}>
			{(field, props) => (
				<TextField
					validationState={field.error.length > 0 ? "invalid" : "valid"}
					class={fieldLayoutClass}>
					<TextField.Input
						value={field.value}
						class={TextField.InputContainer.className}
						placeholder="Name"
						{...props}
					/>
					<TextField.ErrorMessage
						class={twMerge(TextField.ErrorMessage.className, "row-start-2")}>
						{field.error}
					</TextField.ErrorMessage>
				</TextField>
			)}
		</Field>
	)
}

function LanguageField(props: IndexComponentProps) {
	const { Field, formStore } = useController()

	const defaultFilter = (
		option: lang.Language | undefined,
		inputValue: string
	) => {
		if (!option) return true

		return (
			option.toLowerCase().includes(inputValue.toLowerCase()) ||
			stringSimilarity(option, inputValue) > 0.5
		)
	}

	return (
		<Field name={`localized_name.${props.index}.language`}>
			{(field, props) => (
				<Combobox
					required
					name={props.name}
					value={field.value}
					class={fieldLayoutClass}
					defaultFilter={defaultFilter}
					options={localizedLanguageArray}
					onChange={(v) => setValue(formStore, props.name, v!)}
					validationState={field.error.length > 0 ? "invalid" : "valid"}
					itemComponent={(props) => (
						<Combobox.Item
							item={props.item}
							class={ComboboxStyle.Item.className}>
							<Combobox.ItemLabel class="px-1">
								{props.item.rawValue}
							</Combobox.ItemLabel>
						</Combobox.Item>
					)}>
					<Combobox.Control
						aria-label="Language"
						class={twMerge(TextField.InputContainer.className, "flex")}>
						<Combobox.Input
							class={twMerge(
								TextField.Input.className,
								"w-32 rounded-r-none focus:ring-0"
							)}
							placeholder="Language"
						/>
						<Combobox.Trigger class="mr-1 text-slate-700">
							<Combobox.Icon>
								<CaretSortIcon
									height={20}
									width={20}
								/>
							</Combobox.Icon>
						</Combobox.Trigger>
					</Combobox.Control>
					<Combobox.Portal>
						<Combobox.Content as={Card}>
							<Combobox.Listbox class="flex flex-col" />
						</Combobox.Content>
					</Combobox.Portal>
					<Combobox.ErrorMessage
						class={TextField.ErrorMessage.className}
						as="span">
						{field.error}
					</Combobox.ErrorMessage>
				</Combobox>
			)}
		</Field>
	)
}
