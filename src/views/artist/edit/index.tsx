/* @refresh reload */
// oxlint-disable eqeqeq max-lines-per-function
import * as M from "@modular-forms/solid"
import { createForm } from "@modular-forms/solid"
import { useBlocker, useNavigate } from "@tanstack/solid-router"
import { For, Show, Suspense } from "solid-js"
import { ArrowLeftIcon } from "solid-radix-icons"
import * as v from "valibot"

import { ArtistMutation } from "~/api/artist"
import type { Artist } from "~/api/artist"
import type { ArtistType } from "~/api/artist/schema"
import { NewArtistCorrection } from "~/api/artist/schema"
import { Button } from "~/components/button"
import { FormComp } from "~/components/common/form"
import { InputField } from "~/components/common/form/Input"
import { DateWithPrecision } from "~/components/composite/form/DateWithPrecision"
import { Location } from "~/components/composite/form/Location"
import { PageLayout } from "~/layout/PageLayout"

import { AliasesFieldArray } from "./comp/Aliases.tsx"
import { LinksFieldArray } from "./comp/Links.tsx"
import { LocalizedNamesFieldArray } from "./comp/LocalizedNames.tsx"
import { MembershipFieldArray } from "./comp/Membership.tsx"
import { TextAliasesFieldArray } from "./comp/TextAliases.tsx"

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
							fallback={<>Edit Artist</>}
						>
							Create Artist
						</Show>
					</h1>
				</div>
			</div>
			<Suspense fallback={<div>Loading...</div>}>
				<Form {...props} />
			</Suspense>
		</PageLayout>
	)
}

// oxlint-disable-next-line max-lines-per-function
function Form(props: Props) {
	const navigator = useNavigate()

	const mutation = ArtistMutation.getInstance()

	const [formStore, { Form, Field }] = createForm<NewArtistCorrection>({
		validate: M.valiForm(NewArtistCorrection),
		get initialValues(): M.PartialValues<NewArtistCorrection> {
			return props.type == "new" ?
					{
						type: "Create",
						description: "",
						data: {
							name: "",
							artist_type: "Unknown" as const,
							localized_names: [],
							aliases: [],
							text_aliases: [],
							links: [],
							memberships: [],
						},
					}
				:	{
						type: "Update",
						description: "",
						data: {
							name: props.artist.name,
							artist_type: props.artist.artist_type,
							localized_names:
								props.artist.localized_names?.map((ln) => ({
									language_id: ln.language.id,
									name: ln.name,
								})) ?? [],
							aliases: props.artist.aliases ?? [],
							text_aliases: props.artist.text_aliases ?? [],
							start_date:
								props.artist.start_date ?
									{
										value: new Date(props.artist.start_date.value),
										precision: props.artist.start_date.precision,
									}
								:	null,
							end_date:
								props.artist.end_date ?
									{
										value: new Date(props.artist.end_date.value),
										precision: props.artist.end_date.precision,
									}
								:	null,
							links: props.artist.links ?? [],
							start_location: props.artist.start_location,
							current_location: props.artist.current_location,
							memberships:
								props.artist.memberships?.map((m) => ({
									artist_id: m.artist_id,
									roles: m.roles?.map((r) => r.id) ?? [],
									tenure: m.tenure ?? [],
								})) ?? [],
						},
					}
		},
	})

	useBlocker({
		shouldBlockFn() {
			if (!formStore.dirty) {
				return false
			}

			const msg = confirm(
				"Are you sure you want to leave this page? Your changes will be lost.",
			)

			// bro confirmation = unblock...
			return !msg
		},
	})

	const handleSubmit: M.SubmitHandler<NewArtistCorrection> = (data) => {
		const parsed = v.safeParse(NewArtistCorrection, data)
		if (parsed.success) {
			let _ =
				props.type == "new" ?
					mutation.mutate(
						{
							type: "Create",
							data: parsed.output,
						},
						{
							onSuccess() {
								// TODO: navigate to the artist page
								void navigator({
									to: `/`,
								})
							},
							onError() {
								// TODO: show error message
							},
						},
					)
				:	mutation.mutate(
						{
							type: "Update",
							id: props.artist.id,
							data: parsed.output,
						},
						{
							onSuccess() {
								// TODO: navigate to correction page
								void navigator({
									to: `/artist/${props.artist.id}`,
								})
							},
							onError() {
								// TODO: show error message
							},
						},
					)
		} else {
			throw new M.FormError<NewArtistCorrection>(v.summarize(parsed.issues))
		}
	}

	return (
		<Form
			class="col-span-full col-start-2 -col-end-2 flex flex-col gap-16 pt-12 pb-32"
			shouldActive={false}
			onSubmit={handleSubmit}
		>
			<Field name="data.name">
				{(field, props) => (
					<InputField.Root class="w-96">
						<InputField.Label>Name</InputField.Label>
						<InputField.Input
							{...props}
							type="text"
							id="name"
							value={field.value}
						/>
						<InputField.Error message={field.error} />
					</InputField.Root>
				)}
			</Field>

			<Field
				name="data.artist_type"
				type="string"
			>
				{(field, props) => (
					<div class="flex flex-col">
						<FormComp.Label for="artist_type">Artist Type</FormComp.Label>
						<div class="w-fit rounded-sm border border-slate-300">
							<select
								{...props}
								id="artist_type"
								class="h-8 w-fit px-1 whitespace-nowrap"
							>
								<option value="">-- Please select artist type --</option>
								<For each={["Solo", "Multiple", "Unknown"] as ArtistType[]}>
									{(type) => (
										<option
											value={type}
											selected={field.value == type}
										>
											{type}
										</option>
									)}
								</For>
							</select>
						</div>
						<FormComp.ErrorMessage message={field.error} />
					</div>
				)}
			</Field>

			<LocalizedNamesFieldArray formStore={formStore} />

			<AliasesFieldArray formStore={formStore} />

			<TextAliasesFieldArray formStore={formStore} />

			<DateWithPrecision
				label="Start date"
				setValue={(v) => {
					// eslint-disable-next-line @typescript-eslint/no-unsafe-argument
					M.setValue(formStore, "data.start_date", v)
				}}
				error={M.getError(formStore, "data.start_date", {
					shouldActive: false,
				})}
			/>

			<DateWithPrecision
				label="End date"
				setValue={(v) => {
					// eslint-disable-next-line @typescript-eslint/no-unsafe-argument
					M.setValue(formStore, "data.end_date", v)
				}}
				error={M.getError(formStore, "data.end_date", {
					shouldActive: false,
				})}
			/>
			<Location
				label="Start Location"
				setValue={(v) => {
					M.setValue(formStore, "data.start_location", v)
				}}
			/>
			<Location
				label="Current Location"
				setValue={(v) => {
					M.setValue(formStore, "data.current_location", v)
				}}
			/>

			<MembershipFieldArray formStore={formStore} />

			<LinksFieldArray formStore={formStore} />

			<Field name="description">
				{(field, props) => (
					<InputField.Root>
						<InputField.Label>Description</InputField.Label>
						<InputField.Textarea
							{...props}
							id={field.name}
						/>
						<InputField.Error message={field.error} />
					</InputField.Root>
				)}
			</Field>
			<Field name="type">
				{(field, props) => (
					<InputField.Root>
						<InputField.Input
							{...props}
							hidden
							id={field.name}
							value={field.value}
						/>
						<InputField.Error message={field.error} />
					</InputField.Root>
				)}
			</Field>

			{/* <InputField.Root>
				<InputField.Textarea>
					{JSON.stringify(
						M.getValues(formStore, {
							shouldActive: false,
						}),
					)}
				</InputField.Textarea>
			</InputField.Root> */}
			<div class="flex flex-col">
				<Button
					variant="Primary"
					type="submit"
					disabled={mutation.isPending || formStore.submitting}
				>
					{mutation.isPending || formStore.submitting ? "Loading" : "Submit"}
				</Button>

				<FormComp.ErrorMessage message={formStore.response.message} />
				<FormComp.ErrorMessage
					class="text-lg"
					message={
						mutation.isError ? `Error: ${mutation.error.message}` : undefined
					}
				/>
			</div>
		</Form>
	)
}
