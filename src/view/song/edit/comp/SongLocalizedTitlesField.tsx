import { Field, FieldArray, insert, remove, setInput } from "@formisch/solid"
import type { Language, LocalizedTitle } from "@thc/api"
import { For } from "solid-js"
import { createStore } from "solid-js/store"
import { Cross1Icon, PlusIcon } from "solid-radix-icons"
import { twMerge } from "tailwind-merge"

import { Button } from "~/component/atomic/button"
import { FormComp } from "~/component/atomic/form"
import { InputField } from "~/component/atomic/form/Input"
import { FieldArrayFallback } from "~/component/form/FieldArrayFallback"
import { LanguageCombobox } from "~/component/form/stateful/LanguageCombobox"

import type { SongFormStore } from "./types"

export function SongLocalizedTitlesField(props: {
	of: SongFormStore
	initLocalizedTitles?: LocalizedTitle[]
	class?: string
}) {
	const [languages, setLanguages] = createStore<(Language | undefined)[]>(
		(props.initLocalizedTitles ?? []).map((item) => item.language),
	)

	const addLocalizedTitle = () => {
		insert(props.of, {
			path: ["data", "localized_titles"],
		})
		setLanguages(languages.length, undefined)
	}

	const removeLocalizedTitleAt = (index: number) => () => {
		remove(props.of, { path: ["data", "localized_titles"], at: index })
		setLanguages((list) => list.toSpliced(index, 1))
	}

	const setLanguageAt = (index: number) => (lang: Language | null) => {
		if (!lang) return

		setLanguages(index, lang)
		setInput(props.of, {
			path: ["data", "localized_titles", index, "language_id"],
			input: lang.id,
		})
	}

	return (
		<div class={twMerge("flex min-h-32 flex-col", props.class)}>
			<div class="mb-4 flex place-content-between items-center gap-4">
				<FormComp.Label class="m-0">Localized Titles</FormComp.Label>
				<Button
					variant="Tertiary"
					class="h-max p-2"
					onClick={addLocalizedTitle}
				>
					<PlusIcon class="size-4" />
				</Button>
			</div>
			<FieldArray
				of={props.of}
				path={["data", "localized_titles"]}
			>
				{(fa) => (
					<ul class="flex flex-col gap-2">
						<For
							each={fa.items}
							fallback={<FieldArrayFallback />}
						>
							{(_, idx) => (
								<LocalizedTitleItem
									of={props.of}
									index={idx()}
									language={languages[idx()]}
									onSelectLanguage={setLanguageAt(idx())}
									onRemove={removeLocalizedTitleAt(idx())}
								/>
							)}
						</For>
					</ul>
				)}
			</FieldArray>
		</div>
	)
}

function LocalizedTitleItem(props: {
	of: SongFormStore
	index: number
	language: Language | undefined
	onSelectLanguage: (lang: Language | null) => void
	onRemove: () => void
}) {
	return (
		<li class="grid grid-cols-[minmax(0,1fr)_minmax(0,1fr)_auto] gap-2">
			<Field
				of={props.of}
				path={["data", "localized_titles", props.index, "name"]}
			>
				{(field) => (
					<InputField.Root>
						<InputField.Input
							{...field.props}
							placeholder="Title"
							value={field.input as string | undefined}
						/>
						<InputField.Error>
							{field.errors ? field.errors[0] : undefined}
						</InputField.Error>
					</InputField.Root>
				)}
			</Field>
			<Field
				of={props.of}
				path={["data", "localized_titles", props.index, "language_id"]}
			>
				{(field) => (
					<>
						<LanguageCombobox
							onChange={props.onSelectLanguage}
							value={props.language}
						/>
						<input
							{...field.props}
							type="number"
							hidden
							value={field.input ?? undefined}
						/>
					</>
				)}
			</Field>
			<Button
				variant="Tertiary"
				size="Sm"
				onClick={props.onRemove}
			>
				<Cross1Icon />
			</Button>
		</li>
	)
}
