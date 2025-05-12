/* @refresh reload */
import * as M from "@modular-forms/solid"
import { createForm } from "@modular-forms/solid"
import { createMemo, createSignal, For, onMount, Show } from "solid-js"
import { Cross1Icon, PlusIcon } from "solid-radix-icons"
import * as v from "valibot"
import {
	NewArtistCorrection,
	type NewMembership,
	type ArtistType,
} from "~/api/artist/schema"
import { Button } from "~/components/button"
import { FormComp } from "~/components/common/form"
import { InputField } from "~/components/common/form/Input"
import { DateWithPrecision } from "~/components/composite/form/DateWithPrecision"
import { Location } from "~/components/composite/form/Location"
import { Divider } from "~/components/divider"
import { PageLayout } from "~/layout/PageLayout"

type Props =
	| {
			type: "new"
	  }
	| {
			type: "edit"
	  }
export default function (props: Props) {
	return (
		<PageLayout class="grid auto-rows-min grid-cols-24">
			<div class="col-span-full grid h-24 grid-cols-subgrid border-b-1 border-slate-300">
				<div class="col-span-full col-start-2 -col-end-2 flex items-center">
					<h1 class="text-2xl">
						<Show
							when={props.type == "new"}
							fallback={<>Edit Artist</>}
						>
							Create Artist
						</Show>
					</h1>
				</div>
			</div>
			<Form {...props} />
		</PageLayout>
	)
}

const TENURE_STRING_SCHMEA = v.message(
	v.pipe(
		v.string(),
		v.regex(/^\d+-\d+(,\d+-\d+)*$/),
		v.transform((value) =>
			value
				.split(",")
				.map((v) => {
					const [start, end] = v.split("-")

					return {
						join_year: start ? parseInt(start) : null,
						leave_year: end ? parseInt(end) : null,
					} satisfies NewMembership["tenure"][number]
				})
				.filter((v) => !!v.join_year && !!v.leave_year),
		),
	),
	"Invalid tenure string",
)

function Form(props: Props) {
	const [formStore, { Form, Field, FieldArray }] =
		createForm<NewArtistCorrection>({
			validate: M.valiForm(NewArtistCorrection),
			initialValues: {
				// eslint-disable-next-line solid/reactivity
				type: props.type == "new" ? "Create" : "Update",
			},
		})

	const handleSubmit = (values: NewArtistCorrection) => {
		console.log(values)
		// 这里可以添加表单提交逻辑
	}

	function Tenure(props: { index: number }) {
		const [error, setError] =
			createSignal<v.InferIssue<typeof TENURE_STRING_SCHMEA>[]>()

		return (
			<InputField.Root class="row-start-3">
				<InputField.Input
					id={`memberships.${props.index}.tenure`}
					placeholder="Tenures, e.g. `1234-5678, 1234-5678`"
					onChange={(e) => {
						const value = e.target.value

						const result = v.safeParse(TENURE_STRING_SCHMEA, value)

						if (result.success) {
							M.setValues(
								formStore,
								`data.memberships.${props.index}.tenure`,
								result.output,
							)
						}
						setError(result.issues)
					}}
				/>
				<For each={error()}>
					{(issue) => <InputField.Error message={issue.message} />}
				</For>
			</InputField.Root>
		)
	}

	return (
		<Form
			class="col-span-full col-start-2 -col-end-2 flex flex-col gap-16 pt-12 pb-32"
			shouldActive={false}
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

			<Field name="data.artist_type">
				{(field, props) => (
					<div class="flex flex-col">
						<FormComp.Label for="artist_type">Artist Type</FormComp.Label>
						<div class="w-fit rounded-sm border border-slate-300">
							<select
								{...props}
								id="artist_type"
								class="h-8 w-fit px-1 whitespace-nowrap"
								value={field.value}
							>
								<option value="">-- Please select artist type --</option>
								<For each={["Solo", "Multiple", "Unknown"] as ArtistType[]}>
									{(type) => <option value={type}>{type}</option>}
								</For>
							</select>
						</div>
						<FormComp.ErrorMessage message={field.error} />
					</div>
				)}
			</Field>

			<FieldArray name="data.localized_names">
				{(fields) => (
					<div class="w-96">
						<div class="mb-4 flex place-content-between items-center gap-4">
							<FormComp.Label class="m-0">Localized Names</FormComp.Label>
							<Button
								variant="Tertiary"
								class="h-max p-2"
								onClick={() => {
									M.insert(formStore, "data.localized_names", {
										// @ts-ignore
										value: undefined,
									})
								}}
							>
								<PlusIcon class="size-4" />
							</Button>
						</div>
						<ul class="flex flex-col gap-2">
							<For each={fields.items}>
								{(_, idx) => (
									<li class="grid grid-cols-[1fr_auto] grid-rows-2 gap-2">
										<Field
											name={`data.localized_names.${idx()}.language_id`}
											type="number"
										>
											{(field, props) => (
												<InputField.Root>
													<InputField.Input
														{...props}
														id={field.name}
														placeholder="Language ID"
													/>
													<InputField.Error message={field.error} />
												</InputField.Root>
											)}
										</Field>
										<Field name={`data.localized_names.${idx()}.name`}>
											{(field, props) => (
												<InputField.Root class="row-start-2">
													<InputField.Input
														{...props}
														id={field.name}
														placeholder="Name"
													/>
													<InputField.Error message={field.error} />
												</InputField.Root>
											)}
										</Field>
										<Button
											variant="Tertiary"
											size="Sm"
											class="row-span-2 w-fit"
											onClick={() => {
												M.remove(formStore, "data.localized_names", {
													at: idx(),
												})
											}}
										>
											<Cross1Icon />
										</Button>

										{idx() < fields.items.length - 1 && <Divider horizonal />}
									</li>
								)}
							</For>
						</ul>
					</div>
				)}
			</FieldArray>

			<FieldArray name="data.aliases">
				{(fields) => (
					<div class="w-96">
						<div class="mb-4 flex place-content-between items-center gap-4">
							<FormComp.Label class="m-0">Aliases</FormComp.Label>
							<Button
								variant="Tertiary"
								class="h-max p-2"
								onClick={() => {
									M.insert(formStore, "data.aliases", {
										// @ts-ignore
										value: undefined,
									})
								}}
							>
								<PlusIcon class="size-4" />
							</Button>
						</div>
						<ul class="flex flex-col gap-2">
							<For each={fields.items}>
								{(_, idx) => (
									<>
										<li class="flex gap-2">
											<Field
												name={`data.aliases.${idx()}`}
												transform={M.toCustom(
													// @ts-expect-error bug
													(v) => {
														return Number(v)
													},
													{
														on: "change",
													},
												)}
											>
												{(field, props) => (
													<InputField.Root class="grow">
														<InputField.Input
															{...props}
															id={field.name}
															placeholder="Alias Artist ID"
														/>
														<InputField.Error message={field.error} />
													</InputField.Root>
												)}
											</Field>
											<Button
												variant="Tertiary"
												size="Sm"
												class="row-span-2 w-fit"
												onClick={() => {
													M.remove(formStore, "data.aliases", {
														at: idx(),
													})
												}}
											>
												<Cross1Icon />
											</Button>
										</li>
										{idx() < fields.items.length - 1 && <Divider horizonal />}
									</>
								)}
							</For>
						</ul>
					</div>
				)}
			</FieldArray>

			<FieldArray name="data.text_aliases">
				{(fields) => (
					<div class="w-96">
						<div class="mb-4 flex place-content-between items-center gap-4">
							<FormComp.Label class="m-0">Text Aliases</FormComp.Label>
							<Button
								variant="Tertiary"
								class="h-max p-2"
								onClick={() => {
									M.insert(formStore, "data.text_aliases", {
										// @ts-ignore
										value: undefined,
									})
								}}
							>
								<PlusIcon class="size-4" />
							</Button>
						</div>
						<ul class="flex flex-col gap-2">
							<For each={fields.items}>
								{(_, idx) => (
									<>
										<li class="flex gap-2">
											<Field name={`data.text_aliases.${idx()}`}>
												{(field, props) => (
													<InputField.Root class="grow">
														<InputField.Input
															{...props}
															id={field.name}
															placeholder="Name"
														/>
														<InputField.Error message={field.error} />
													</InputField.Root>
												)}
											</Field>
											<Button
												variant="Tertiary"
												size="Sm"
												class="row-span-2 w-fit"
												onClick={() => {
													M.remove(formStore, "data.text_aliases", {
														at: idx(),
													})
												}}
											>
												<Cross1Icon />
											</Button>
										</li>
										{idx() < fields.items.length - 1 && <Divider horizonal />}
									</>
								)}
							</For>
						</ul>
					</div>
				)}
			</FieldArray>

			<DateWithPrecision
				label="Start date"
				setValue={(v) => {
					M.setValue(formStore, "data.start_date", v)
				}}
			/>
			<DateWithPrecision
				label="End date"
				setValue={(v) => {
					M.setValue(formStore, "data.end_date", v)
				}}
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

			<FieldArray name="data.memberships">
				{(fields) => {
					const isDisabled = createMemo(() => {
						const type = M.getValue(formStore, "data.artist_type")
						return !type || type == "Unknown"
					})
					return (
						<div class="w-96">
							<div class="mb-4 flex place-content-between items-center gap-4">
								<FormComp.Label class="m-0">Membership</FormComp.Label>
								<Button
									variant="Tertiary"
									class="h-max p-2"
									disabled={isDisabled()}
									onClick={() => {
										M.insert(formStore, "data.memberships", {
											// @ts-ignore
											value: undefined,
										})
									}}
								>
									<PlusIcon class="size-4" />
								</Button>
							</div>
							<ul class="flex flex-col gap-2">
								<For each={fields.items}>
									{(_, idx) => {
										onMount(() => {
											// @ts-expect-error
											M.setValues(
												formStore,
												`data.memberships.${idx()}.tenure`,
												[null],
											)
											// @ts-expect-error
											M.setValues(
												formStore,
												`data.memberships.${idx()}.roles`,
												[null],
											)
										})
										return (
											<>
												<li class="grid grid-cols-[1fr_auto] gap-2">
													<Field
														name={`data.memberships.${idx()}.artist_id`}
														type="number"
													>
														{(field, props) => (
															<InputField.Root class="grow">
																<InputField.Input
																	{...props}
																	id={field.name}
																	type="number"
																	class="no-spinner"
																	placeholder="Artist ID"
																/>
																<InputField.Error message={field.error} />
															</InputField.Root>
														)}
													</Field>
													<InputField.Root class="row-start-2">
														<InputField.Input
															id={`memberships.${idx()}.roles`}
															placeholder="Role IDs, e.g. `1,2,3`"
															onChange={(e) => {
																const value = e.target.value
																const result = value.split(",").map((v) => {
																	return parseInt(
																		v,
																	) satisfies NewMembership["roles"][number]
																})
																M.setValues(
																	formStore,
																	`data.memberships.${idx()}.roles`,
																	result,
																)
															}}
														/>
														{/* <InputField.Error message={} /> */}
													</InputField.Root>
													<Tenure index={idx()} />

													<Button
														variant="Tertiary"
														size="Sm"
														class="col-start-2 row-span-3"
														onClick={() => {
															M.remove(formStore, "data.memberships", {
																at: idx(),
															})
														}}
													>
														<Cross1Icon />
													</Button>
												</li>
												{idx() < fields.items.length - 1 && (
													<Divider horizonal />
												)}
											</>
										)
									}}
								</For>
							</ul>
						</div>
					)
				}}
			</FieldArray>

			<FieldArray name="data.links">
				{(fields) => (
					<div class="w-96">
						<div class="mb-4 flex place-content-between items-center gap-4">
							<FormComp.Label class="m-0">Links</FormComp.Label>
							<Button
								variant="Tertiary"
								class="h-max p-2"
								onClick={() => {
									M.insert(formStore, "data.links", {
										// @ts-ignore
										value: undefined,
									})
								}}
							>
								<PlusIcon class="size-4" />
							</Button>
						</div>
						<ul class="flex flex-col gap-2">
							<For each={fields.items}>
								{(_, idx) => (
									<>
										<li class="flex gap-2">
											<Field name={`data.links.${idx()}`}>
												{(field, props) => (
													<InputField.Root class="grow">
														<InputField.Input
															{...props}
															id={field.name}
															type="url"
															placeholder="Url"
														/>
														<InputField.Error message={field.error} />
													</InputField.Root>
												)}
											</Field>
											<Button
												variant="Tertiary"
												size="Sm"
												class="row-span-2 w-fit"
												onClick={() => {
													M.remove(formStore, "data.links", {
														at: idx(),
													})
												}}
											>
												<Cross1Icon />
											</Button>
										</li>
										{idx() < fields.items.length - 1 && <Divider horizonal />}
									</>
								)}
							</For>
						</ul>
					</div>
				)}
			</FieldArray>

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
							value=""
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

			<Button
				variant="Primary"
				type="submit"
				onClick={() => {
					console.log(M.getValues(formStore))
				}}
			>
				Submit
			</Button>
			<FormComp.ErrorMessage message={formStore.response.message} />
		</Form>
	)
}
