import { Form, createForm, getErrors, setInput } from "@formisch/solid"
//
import { Trans, useLingui } from "@lingui-solid/solid/macro"
import { useBlocker } from "@tanstack/solid-router"
import type { Release } from "@thc/api"
import type { JSX } from "solid-js"
import { Show } from "solid-js"

import { Button } from "~/component/atomic/button"
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
import { useReleaseFormSubmission } from "./hook/useFormSubmission"

type Props =
	| {
			type: "new"
	  }
	| {
			type: "edit"
			release: Release
	  }

export function EditReleasePage(props: Props): JSX.Element {
	return (
		<PageLayout class="grid grid-rows-[auto_1fr_auto]">
			<PageHeader type={props.type} />
			<FormContent {...props} />

			<div class="sticky bottom-0 col-span-full flex justify-end gap-4 border-t border-slate-200 bg-white p-4">
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
		</PageLayout>
	)
}

function PageHeader(props: { type: Props["type"] }) {
	return (
		<div class="border-b-1 border-slate-300 p-8">
			<div class="flex items-center gap-4">
				<Button
					class="size-6 p-0"
					variant="Tertiary"
					size="Sm"
					onClick={() => {
						history.back()
					}}
				>
					<span class="sr-only">Back</span>
					{/* simple back chevron */}
					<div aria-hidden>‹</div>
				</Button>
				<h1 class="text-2xl font-light">
					<Show
						when={props.type === "new"}
						fallback={<Trans>Edit Release</Trans>}
					>
						<Trans>Create Release</Trans>
					</Show>
				</h1>
			</div>
		</div>
	)
}

function useReleaseFormInitialValues(props: Props): NewReleaseCorrection {
	return props.type === "new"
		? {
				type: "Create",
				description: "",
				data: {
					title: "",
					release_type: undefined as unknown as never,
					release_date: undefined,
					recording_date_start: undefined,
					recording_date_end: undefined,
					localized_titles: [],
					artists: [],
					events: [],
					catalog_nums: [],
					credits: [],
					discs: [{ name: "" }],
					tracks: [],
				},
			}
		: {
				type: "Update",
				description: "",
				data: {
					title: props.release.title,
					release_type: props.release.release_type,
					release_date: props.release.release_date
						? {
								value: new Date(props.release.release_date.value),
								precision: props.release.release_date.precision,
							}
						: undefined,
					recording_date_start: props.release.recording_date_start
						? {
								value: new Date(props.release.recording_date_start.value),
								precision: props.release.recording_date_start.precision,
							}
						: undefined,
					recording_date_end: props.release.recording_date_end
						? {
								value: new Date(props.release.recording_date_end.value),
								precision: props.release.recording_date_end.precision,
							}
						: undefined,
					localized_titles:
						props.release.localized_titles?.map((lt) => ({
							language_id: lt.language.id,
							title: lt.title,
						})) ?? [],
					artists: props.release.artists?.map((a) => a.id) ?? [],
					events: [],
					catalog_nums: props.release.catalog_nums ?? [],
					credits: [],
					discs:
						props.release.discs?.map((d) => ({ name: d.name ?? undefined }))
						?? [],
					tracks: [],
				},
			}
}

// oxlint-disable-next-line max-lines-per-function
function FormContent(props: Props) {
	const { t } = useLingui()
	const initialValues = useReleaseFormInitialValues(props)

	const form = createForm({
		schema: NewReleaseCorrectionSchema,
		initialInput: initialValues,
	})

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
			class="grid grid-cols-5 content-start space-y-8 px-8 pt-8"
			onSubmit={handleSubmit}
		>
			<TitleField
				of={form}
				class="col-span-2 row-start-1"
			/>

			<ReleaseTypeField
				of={form}
				class="col-span-2 row-start-2"
			/>

			<LocalizedTitlesField
				of={form}
				class="col-span-2 row-start-3"
			/>

			<DateWithPrecision
				class="col-span-3 row-start-4"
				label={t`Release date`}
				setValue={(v) =>
					setInput(form, {
						path: ["data", "release_date"],
						input: v ?? ({} as unknown as never),
					})
				}
				error={
					getErrors(form, {
						path: ["data", "release_date"],
					})?.[0]
				}
			/>

			<DateWithPrecision
				class="col-span-3 row-start-5"
				label={t`Recording start`}
				setValue={(v) =>
					setInput(form, {
						path: ["data", "recording_date_start"],
						input: v ?? ({} as unknown as never),
					})
				}
				error={
					getErrors(form, {
						path: ["data", "recording_date_start"],
					})?.[0]
				}
			/>

			<DateWithPrecision
				class="col-span-3 row-start-6"
				label={t`Recording end`}
				setValue={(v) =>
					setInput(form, {
						path: ["data", "recording_date_end"],
						input: v ?? ({} as unknown as never),
					})
				}
				error={
					getErrors(form, {
						path: ["data", "recording_date_end"],
					})?.[0]
				}
			/>

			<ReleaseArtistsField
				of={form}
				class="col-span-2 row-start-7"
			/>

			<ReleaseCatalogNumbersField
				of={form}
				class="col-span-2 row-start-8"
			/>

			<ReleaseEventsField
				of={form}
				class="col-span-2 row-start-9"
			/>

			<ReleaseTracksField
				of={form}
				class="row-start-10"
			/>

			<ReleaseCreditsField
				of={form}
				class="row-start-11"
			/>
		</Form>
	)
}
