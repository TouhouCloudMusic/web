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

import { AliasesFieldArray } from "./comp/Aliases.tsx"
import { ArtistFormNameField } from "./comp/ArtistName.tsx"
import { ArtistFormArtistTypeField } from "./comp/ArtistType.tsx"
import { ArtistFormDateFields } from "./comp/Date.tsx"
import { ArtistFormFormActions } from "./comp/FormActions.tsx"
import { LinksFieldArray } from "./comp/Links.tsx"
import { LocalizedNamesFieldArray } from "./comp/LocalizedNames.tsx"
import { ArtistFormLocationFields } from "./comp/Locations.tsx"
import { MembershipFieldArray } from "./comp/Membership.tsx"
import { TextAliasesFieldArray } from "./comp/TextAliases.tsx"
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
		<PageLayout class="grid auto-rows-min grid-cols-24">
			<div class="col-span-full grid h-24 grid-cols-subgrid border-b-1 border-slate-300">
				<div class="col-span-full col-start-2 -col-end-2 flex items-center gap-4">
					<Button
						class="px-0"
						variant="Tertiary"
						size="Sm"
						onClick={() => {
							history.back()
						}}
					>
						<ArrowLeftIcon class="size-6" />
					</Button>
					<h1 class="text-2xl">
						<Show
							when={props.type === "new"}
							fallback={<Trans>Edit Artist</Trans>}
						>
							<Trans>Create Artist</Trans>
						</Show>
					</h1>
				</div>
			</div>
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
			class="col-span-full col-start-2 -col-end-2 flex flex-col gap-16 pt-12 pb-32"
			shouldActive={false}
			onSubmit={handleSubmit}
		>
			<ArtistFormNameField formStore={formStore} />

			<ArtistFormArtistTypeField formStore={formStore} />

			<LocalizedNamesFieldArray formStore={formStore} />

			<AliasesFieldArray formStore={formStore} />

			<TextAliasesFieldArray formStore={formStore} />

			<ArtistFormDateFields formStore={formStore} />

			<ArtistFormLocationFields formStore={formStore} />

			<MembershipFieldArray formStore={formStore} />

			<LinksFieldArray formStore={formStore} />

			<ArtistFormFormActions
				formStore={formStore}
				mutation={mutation}
			/>
		</Form>
	)
}
