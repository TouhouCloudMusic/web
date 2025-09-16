import {
	Field,
	FieldArray,
	getErrors,
	insert,
	remove,
	setInput,
} from "@formisch/solid"
import type { Language } from "@thc/api"
import { For } from "solid-js"
import { createStore } from "solid-js/store"
import { Cross1Icon, PlusIcon } from "solid-radix-icons"
import { twMerge } from "tailwind-merge"

import { Button } from "~/component/atomic/button"
import { FormComp } from "~/component/atomic/form"
import { FieldArrayFallback } from "~/component/form/FieldArrayFallback"
import { LanguageCombobox } from "~/component/form/stateful/LanguageCombobox"

import type { SongFormStore } from "./types"

export function SongLanguagesField(props: {
	of: SongFormStore
	initLanguages?: Language[]
	class?: string
}) {
	const [selectedLanguages, setSelectedLanguages] = createStore<
		(Language | undefined)[]
	>([...(props.initLanguages ?? [])])

	const addLanguage = () => {
		insert(props.of, {
			path: ["data", "languages"],
		})
		setSelectedLanguages(selectedLanguages.length, undefined)
	}

	const removeLanguageAt = (index: number) => () => {
		remove(props.of, { path: ["data", "languages"], at: index })
		setSelectedLanguages((list) => list.toSpliced(index, 1))
	}

	const setLanguageAt = (index: number) => (lang: Language | null) => {
		if (!lang) return
		const alreadySelected = selectedLanguages.some(
			(entry, entryIndex) => entry?.id === lang.id && entryIndex !== index,
		)
		if (alreadySelected) return

		setSelectedLanguages(index, lang)
		setInput(props.of, {
			path: ["data", "languages", index],
			input: lang.id,
		})
	}

	return (
		<div class={twMerge("flex flex-col", props.class)}>
			<div class="mb-4 flex place-content-between items-center gap-4">
				<FormComp.Label class="m-0">Languages</FormComp.Label>
				<Button
					variant="Tertiary"
					class="h-max p-2"
					onClick={addLanguage}
				>
					<PlusIcon class="size-4" />
				</Button>
			</div>
			<FormComp.ErrorList
				errors={getErrors(props.of, { path: ["data", "languages"] })}
			/>
			<FieldArray
				of={props.of}
				path={["data", "languages"]}
			>
				{(fieldArray) => (
					<ul class="flex flex-col gap-2">
						<For
							each={fieldArray.items}
							fallback={<FieldArrayFallback />}
						>
							{(_, idx) => (
								<li class="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-2">
									<Field
										of={props.of}
										path={["data", "languages", idx()]}
									>
										{(field) => (
											<>
												<LanguageCombobox
													onChange={setLanguageAt(idx())}
													value={selectedLanguages[idx()]}
												/>
												<input
													{...field.props}
													type="number"
													hidden
													value={field.input ?? undefined}
												/>
												<For each={field.errors}>
													{(error) => (
														<FormComp.ErrorMessage>
															{error}
														</FormComp.ErrorMessage>
													)}
												</For>
											</>
										)}
									</Field>
									<Button
										variant="Tertiary"
										size="Sm"
										onClick={removeLanguageAt(idx())}
									>
										<Cross1Icon />
									</Button>
								</li>
							)}
						</For>
					</ul>
				)}
			</FieldArray>
		</div>
	)
}
