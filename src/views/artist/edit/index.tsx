/* @refresh reload */
import { Trans, useLingui } from "@lingui-solid/solid/macro"
import * as M from "@modular-forms/solid"
import { createForm } from "@modular-forms/solid"
import { useBlocker } from "@tanstack/solid-router"
import { Show, Suspense } from "solid-js"
import { ArrowLeftIcon } from "solid-radix-icons"

import type { Artist } from "~/api/artist"
import type { NewArtistCorrection } from "~/api/artist/schema"
import { NewArtistCorrection as NewArtistCorrectionSchema } from "~/api/artist/schema"
import { Button } from "~/components/button"
import { PageLayout } from "~/layout/PageLayout"

import { ArtistFormAliasesField } from "./comp/Aliases.tsx"
import { ArtistFormNameField } from "./comp/ArtistName.tsx"
import { ArtistFormArtistTypeField } from "./comp/ArtistType.tsx"
import { ArtistFormDateFields } from "./comp/Date.tsx"
import { ArtistFormActions } from "./comp/FormActions.tsx"
import { ArtistFormLinks } from "./comp/Links.tsx"
import { ArtistFormLocalizedNames } from "./comp/LocalizedNames.tsx"
import { ArtistFormLocationFields } from "./comp/Locations.tsx"
import { ArtistFormMembership } from "./comp/Membership.tsx"
import { ArtistFormTextAliases } from "./comp/TextAliases.tsx"
import { useArtistFormInitialValues } from "./hook/useFormInitialValues.tsx"
import { useArtistFormSubmission } from "./hook/useFormSubmission.tsx"

type Props =
	| {
			type: "new"
	  }
	| {
			type: "edit"
			artist: Artist
	  }

export function EditArtistPage(props: Props) {
	return (
		<PageLayout class="grid grid-rows-[1fr_auto_1fr]">
			<PageHeader type={props.type} />
			<Suspense
				fallback={
					<div>
						<Trans>Loading...</Trans>
					</div>
				}
			>
				<Form {...props} />
			</Suspense>
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
					<ArrowLeftIcon class="size-6" />
				</Button>
				<h1 class="text-2xl font-light">
					<Show
						when={props.type === "new"}
						fallback={<Trans>Edit Artist</Trans>}
					>
						<Trans>Create Artist</Trans>
					</Show>
				</h1>
			</div>
		</div>
	)
}

function Form(props: Props) {
	const { t } = useLingui()
	const initialValues = useArtistFormInitialValues(props)
	const { handleSubmit, mutation } = useArtistFormSubmission(props)

	const [formStore, { Form }] = createForm<NewArtistCorrection>({
		validate: M.valiForm(NewArtistCorrectionSchema),
		initialValues,
	})

	useBlocker({
		shouldBlockFn() {
			if (!formStore.dirty) {
				return false
			}

			const msg = confirm(
				t`Are you sure you want to leave this page? Your changes will be lost.`,
			)

			// bro confirmation = unblock...
			return !msg
		},
	})

	return (
		<Form
			class="flex flex-col gap-y-8 px-8 pt-8"
			shouldActive={false}
			onSubmit={handleSubmit}
		>
			<ArtistFormNameField formStore={formStore} />

			<ArtistFormArtistTypeField formStore={formStore} />

			<ArtistFormLocalizedNames formStore={formStore} />

			<ArtistFormAliasesField formStore={formStore} />

			<ArtistFormTextAliases formStore={formStore} />

			<ArtistFormDateFields formStore={formStore} />

			<ArtistFormLocationFields formStore={formStore} />

			<ArtistFormMembership formStore={formStore} />

			<ArtistFormLinks formStore={formStore} />

			<ArtistFormActions
				formStore={formStore}
				mutation={mutation}
			/>
		</Form>
	)
}
