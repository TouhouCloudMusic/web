import {
	Form,
	createForm,
	getErrors,
	getInput,
	setInput,
} from "@formisch/solid"
import { Trans, useLingui } from "@lingui-solid/solid/macro"
import { useBlocker } from "@tanstack/solid-router"
import type { JSX } from "solid-js"
import { createEffect, Show } from "solid-js"

import { Button } from "~/component/atomic/button"
import { FormComp } from "~/component/atomic/form"
import { DateWithPrecision } from "~/component/form/DateWithPrecision"
import { NewReleaseCorrection as NewReleaseCorrectionSchema } from "~/domain/release"
import type { NewReleaseCorrection } from "~/domain/release"
import { PageLayout } from "~/layout/PageLayout"

import { LocalizedTitlesField } from "./comp/LocalizedTitlesField"
import { ReleaseArtistsField } from "./comp/ReleaseArtistsField"
import { ReleaseCatalogNumbersField } from "./comp/ReleaseCatalogNumbersField"
import { ReleaseCreditsField } from "./comp/ReleaseCreditsField"
import { ReleaseEventsField } from "./comp/ReleaseEventsField"
import { ReleaseTracksField } from "./comp/ReleaseTracksField"
import { ReleaseTypeField } from "./comp/ReleaseTypeField"
import { TitleField } from "./comp/TitleField"
import { useReleaseFormInitialValues } from "./hook/useFormInitialValues"
import type { EditReleasePageProps as Props } from "./hook/useFormInitialValues"
import { useReleaseFormSubmission } from "./hook/useFormSubmission"
import { ReleaseFormContextProvider } from "./store/context"

export function EditReleasePage(props: Props): JSX.Element {
	return (
		<PageLayout class="grid grid-rows-[auto_1fr_auto]">
			<PageHeader type={props.type} />
			<FormContent {...props} />

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
					>
						<Trans>Submit</Trans>
					</Button>
				</div>
			</div>
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
						fallback={<>Edit Release</>}
					>
						Create Release
					</Show>
				</h1>
			</div>
		</div>
	)
}

// oxlint-disable-next-line max-lines-per-function
function FormContent(props: Props) {
	const { t } = useLingui()
	const initialValues = useReleaseFormInitialValues(props)

	const form = createForm({
		schema: NewReleaseCorrectionSchema,
		initialInput: initialValues,
	})

	if (import.meta.env.DEV) {
		createEffect(() => {
			let val = getInput(form)
			console.log(val)
			let err = getErrors(form)
			console.log(err)
		})
	}

	const { handleSubmit } = useReleaseFormSubmission(props)

	useBlocker({
		shouldBlockFn() {
			if (!form.isDirty) return false

			const msg = confirm(
				t`Are you sure you want to leave this page? Your changes will be lost.`,
			)
			return !msg
		},
	})

	return (
		<Form
			of={form}
			class="grid grid-cols-5 content-start space-y-8 gap-x-2 px-8 pt-8"
			onSubmit={handleSubmit}
		>
			<ReleaseFormContextProvider
				form={form}
				initValue={props.type === "edit" ? props.release : undefined}
			>
				<TitleField
					of={form}
					class="col-span-2 row-start-1"
				/>

				<ReleaseTypeField
					of={form}
					class="col-span-1 row-start-2"
				/>

				<LocalizedTitlesField
					of={form}
					class="col-span-2 row-start-3"
				/>

				{(
					[
						{
							key: "release_date",
							label: t`Release date`,
							class: "row-start-4",
						},
						{
							key: "recording_date_start",
							label: t`Recording start`,
							class: "row-start-5",
						},
						{
							key: "recording_date_end",
							label: t`Recording end`,
							class: "row-start-6",
						},
					] as const
				).map((it) => {
					return (
						<div
							class={["col-span-3 grid grid-cols-subgrid", it.class].join(" ")}
						>
							<FormComp.Label class="col-span-full">{it.label}</FormComp.Label>
							<DateWithPrecision
								setValue={(v) =>
									setInput(form, {
										path: ["data", it.key],
										// Upstream Error: https://github.com/fabian-hiller/formisch/issues/15
										input: v ?? ({} as unknown as never),
									})
								}
							/>
							<FormComp.ErrorMessage>
								{
									getErrors(form, {
										path: ["data", it.key],
									})?.[0]
								}
							</FormComp.ErrorMessage>
						</div>
					)
				})}

				<ReleaseArtistsField class="col-span-2 row-start-7" />

				<ReleaseCatalogNumbersField
					of={form}
					class="col-span-2 row-start-8"
				/>

				<ReleaseEventsField class="col-span-2 row-start-9" />

				<ReleaseTracksField class="col-span-2 row-start-10" />

				<ReleaseCreditsField class="col-span-2 row-start-11" />
			</ReleaseFormContextProvider>
		</Form>
	)
}
