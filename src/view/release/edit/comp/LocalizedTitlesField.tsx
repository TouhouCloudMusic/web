// 多语言标题字段
import { Field, FieldArray, insert, remove, setInput } from "@formisch/solid"
import { Trans } from "@lingui-solid/solid/macro"
import { useQuery } from "@tanstack/solid-query"
import { LanguagesQuery } from "@thc/query"
import { For } from "solid-js"
import { CheckIcon, Cross1Icon, PlusIcon } from "solid-radix-icons"

import { Combobox } from "~/component/atomic/Combobox"
import { Divider } from "~/component/atomic/Divider"
import { Button } from "~/component/atomic/button"
import { FormComp } from "~/component/atomic/form"
import { InputField } from "~/component/atomic/form/Input"
import type { NewLocalizedTitle } from "~/domain/release"

import type { ReleaseFormStore } from "./types"

export function LocalizedTitlesField(props: { of: ReleaseFormStore }) {
	const langs = useQuery(() => LanguagesQuery.findAll())

	return (
		<FieldArray
			of={props.of}
			path={["data", "localized_titles"]}
		>
			{(fa) => (
				<div class="flex min-h-32 w-96 flex-col">
					<div class="mb-4 flex place-content-between items-center gap-4">
						<FormComp.Label class="m-0">
							<Trans>Localized Titles</Trans>
						</FormComp.Label>
						<Button
							variant="Tertiary"
							class="h-max p-2"
							onClick={() =>
								insert(props.of, {
									path: ["data", "localized_titles"],
									initialInput: {
										language_id: undefined,
										title: "",
									} as unknown as NewLocalizedTitle,
								})
							}
						>
							<PlusIcon class="size-4" />
						</Button>
					</div>
					<ul class="flex h-full flex-col gap-2">
						<For each={fa.items}>
							{(_, idx) => (
								<li class="grid grid-cols-[1fr_auto] grid-rows-2 gap-2">
									<LanguageCombobox
										index={idx()}
										langs={langs.data ?? []}
										of={props.of}
									/>
									<Field
										of={props.of}
										path={["data", "localized_titles", idx(), "title"]}
									>
										{(field) => (
											<InputField.Root>
												<InputField.Input
													{...field.props}
													placeholder="Localized title"
													value={field.input as string | undefined}
												/>
												<InputField.Error>
													{field.errors ? field.errors[0] : undefined}
												</InputField.Error>
											</InputField.Root>
										)}
									</Field>

									<Button
										variant="Tertiary"
										size="Sm"
										onClick={() =>
											remove(props.of, { path: ["data", "localized_titles"], at: idx() })
										}
									>
										<Cross1Icon />
									</Button>
									{idx() < fa.items.length - 1 && <Divider horizontal />}
								</li>
							)}
						</For>
					</ul>
				</div>
			)}
		</FieldArray>
	)
}

function LanguageCombobox(props: {
	index: number
	langs: { id: number; name: string }[]
	of: ReleaseFormStore
}) {
    let onChange = (v: { id: number; name: string } | null) => {
        setInput(props.of, {
            path: ["data", "localized_titles", props.index, "language_id"],
            // 允许清空语言
            input: (v ? v.id : undefined) as unknown as number,
        })
    }

	return (
		<Combobox.Root
			placeholder="Select language"
			options={props.langs}
			optionValue="id"
			optionTextValue="name"
			optionLabel="name"
			onChange={onChange}
			itemComponent={(itemProps) => (
				<Combobox.Item item={itemProps.item}>
					<Combobox.ItemLabel>
						{itemProps.item.rawValue.name}
					</Combobox.ItemLabel>
					<Combobox.ItemIndicator>
						<CheckIcon class="text-primary" />
					</Combobox.ItemIndicator>
				</Combobox.Item>
			)}
		>
			<Combobox.Control>
				<Combobox.Input />
				<Combobox.Trigger>
					<Combobox.Icon />
				</Combobox.Trigger>
			</Combobox.Control>

			<Combobox.Portal>
				<Combobox.Content>
					<Combobox.Listbox />
				</Combobox.Content>
			</Combobox.Portal>
		</Combobox.Root>
	)
}
