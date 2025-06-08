// oxlint-disable max-lines-per-function
import * as M from "@modular-forms/solid"
import { createMemo, createSignal, For, onMount } from "solid-js"
import { Cross1Icon, PlusIcon } from "solid-radix-icons"
import * as v from "valibot"

import type { NewArtistCorrection, Tenure } from "~/api/artist/schema"
import { Button } from "~/components/button"
import { FormComp } from "~/components/common/form"
import { InputField } from "~/components/common/form/Input"
import { Divider } from "~/components/divider"

type MembershipProps = {
	formStore: M.FormStore<NewArtistCorrection>
}

export function MembershipFieldArray(props: MembershipProps) {
	return (
		<M.FieldArray
			of={props.formStore}
			name="data.memberships"
		>
			{(fields) => {
				const isDisabled = createMemo(() => {
					const type = M.getValue(props.formStore, "data.artist_type")
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
									M.insert(props.formStore, "data.memberships", {
										// @ts-expect-error
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
											props.formStore,
											`data.memberships.${idx()}.tenure`,
											[undefined],
										)
										// @ts-expect-error
										M.setValues(
											props.formStore,
											`data.memberships.${idx()}.roles`,
											[undefined],
										)
									})
									return (
										<>
											<li class="grid grid-cols-[1fr_auto] gap-2">
												<M.Field
													of={props.formStore}
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
												</M.Field>
												<InputField.Root class="row-start-2">
													<InputField.Input
														id={`memberships.${idx()}.roles`}
														placeholder="Role IDs, e.g. `1,2,3`"
														onChange={(e) => {
															const value = e.target.value
															const result = value.split(",").map((v) => {
																return Number.parseInt(v, 10)
															})
															M.setValues(
																props.formStore,
																`data.memberships.${idx()}.roles`,
																result,
															)
														}}
													/>
													{/* <InputField.Error message={} /> */}
												</InputField.Root>
												<TenureField
													index={idx()}
													formStore={props.formStore}
												/>

												<Button
													variant="Tertiary"
													size="Sm"
													class="col-start-2 row-span-3"
													onClick={() => {
														M.remove(props.formStore, "data.memberships", {
															at: idx(),
														})
													}}
												>
													<Cross1Icon />
												</Button>
											</li>
											{idx() < fields.items.length - 1 && <Divider horizonal />}
										</>
									)
								}}
							</For>
						</ul>
					</div>
				)
			}}
		</M.FieldArray>
	)
}

const TENURE_STRING_SCHMEA = v.message(
	v.pipe(
		v.string(),
		v.regex(/^\d+-\d+(,\d+-\d+)*$/),
		v.transform((value) =>
			value
				.split(",")
				.map((item): Tenure => {
					const [start, end] = item.split("-")

					return {
						join_year: start ? Number.parseInt(start, 10) : undefined,
						leave_year: end ? Number.parseInt(end, 10) : undefined,
					}
				})
				.filter((item) => !!item.join_year && !!item.leave_year),
		),
	),
	"Invalid tenure string, e.g. `1234-5678,1234-5678`",
)

function TenureField(props: {
	index: number
	formStore: M.FormStore<NewArtistCorrection>
}) {
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
							props.formStore,
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
