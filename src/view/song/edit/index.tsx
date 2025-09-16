import { Form, createForm, getAllErrors, getInput } from "@formisch/solid"
import { Trans, useLingui } from "@lingui-solid/solid/macro"
import { useBlocker } from "@tanstack/solid-router"
import type { JSX } from "solid-js"
import { createEffect, Show } from "solid-js"

import { Button } from "~/component/atomic/button"
import { NewSongCorrection } from "~/domain/song"
import { PageLayout } from "~/layout/PageLayout"

import { SongCreditsField } from "./comp/SongCreditsField"
import { SongLanguagesField } from "./comp/SongLanguagesField"
import { SongLocalizedTitlesField } from "./comp/SongLocalizedTitlesField"
import { SongTitleField } from "./comp/SongTitleField"
import type { EditSongPageProps as Props } from "./hook/useFormInitialValues"
import { useSongFormInitialValues } from "./hook/useFormInitialValues"
import { useSongFormSubmission } from "./hook/useFormSubmission"

export function EditSongPage(props: Props): JSX.Element {
	return (
		<PageLayout class="grid grid-rows-[auto_1fr_auto]">
			<PageHeader type={props.type} />
			<FormContent {...props} />
		</PageLayout>
	)
}

function PageHeader(props: { type: Props["type"] }) {
	return (
		<div class="border-b-1 border-slate-300 p-8">
			<div class="flex items-center gap-4">
				<h1 class="text-2xl font-light">
					<Show
						when={props.type === "new"}
						fallback={<>Edit Song</>}
					>
						Create Song
					</Show>
				</h1>
			</div>
		</div>
	)
}

function FormContent(props: Props) {
	const { t } = useLingui()
	const initialValues = useSongFormInitialValues(props)

	const form = createForm({
		schema: NewSongCorrection,
		initialInput: initialValues,
	})

	if (import.meta.env.DEV) {
		createEffect(() => {
			const val = getInput(form)
			console.log(val)
		})
	}

	const { handleSubmit } = useSongFormSubmission(props)

	useBlocker({
		shouldBlockFn() {
			if (form.isSubmitted) return false
			if (form.isDirty) return true

			const msg = confirm(
				t`Are you sure you want to leave this page? Your changes will be lost.`,
			)
			return !msg
		},
	})

	return (
		<Form
			of={form}
			onSubmit={(out) => handleSubmit(out)}
		>
			<div class="grid grid-cols-4 content-start gap-x-2 gap-y-8 px-8 pt-8">
				<SongTitleField
					of={form}
					class="col-span-2"
				/>

				<SongLanguagesField
					of={form}
					initLanguages={
						props.type === "edit" ? (props.song.languages ?? []) : []
					}
					class="col-span-2"
				/>

				<SongLocalizedTitlesField
					of={form}
					initLocalizedTitles={
						props.type === "edit" ? (props.song.localized_titles ?? []) : []
					}
					class="col-span-4"
				/>

				<SongCreditsField
					of={form}
					initCredits={props.type === "edit" ? (props.song.credits ?? []) : []}
					class="col-span-4"
				/>
			</div>
			<div class="sticky bottom-0 col-span-full mt-12 flex justify-end border-t border-slate-300 bg-white p-4">
				<div class="grid grid-cols-2 gap-2">
					<Button
						variant="Tertiary"
						onClick={() => history.back()}
					>
						<Trans>Back</Trans>
					</Button>
					<Button
						variant="Primary"
						type="submit"
						class={form.isSubmitting ? "cursor-wait opacity-80" : ""}
						onClick={() => {
							if (import.meta.env.DEV) {
								const errs = getAllErrors(form)
								console.log(errs)
							}
						}}
					>
						<Trans>{form.isSubmitting ? "Submitting" : "Submit"}</Trans>
					</Button>
				</div>
			</div>
		</Form>
	)
}
