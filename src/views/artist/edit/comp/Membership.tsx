// oxlint-disable max-lines-per-function
import * as M from "@modular-forms/solid"
import { createEffect, createMemo, createSignal, For, onMount } from "solid-js"
import { createStore, produce } from "solid-js/store"
import { Cross1Icon } from "solid-radix-icons"
import * as v from "valibot"

import type { Artist } from "~/api/artist"
import type { NewArtistCorrection, Tenure } from "~/api/artist/schema"
import { Button } from "~/components/button"
import { FormComp } from "~/components/common/form"
import { InputField } from "~/components/common/form/Input"
import { Divider } from "~/components/divider"

import { ArtistSearchDialog } from "./ArtistSearchDialog"
import { FieldArrayFallback } from "./FieldArrayFallback"

type MembershipProps = {
	formStore: M.FormStore<NewArtistCorrection>
}

export function ArtistFormMembership(props: MembershipProps) {
	let [membershipStore, setMembershipStore] = createStore({
		items: [] as Artist[],
	})

	let handleSelect = (artist: Artist) => {
		const exist = membershipStore.items.some(
			(membership) => membership.id === artist.id,
		)
		if (!exist) {
			setMembershipStore(
				produce((s) => {
					s.items.push(artist)
				}),
			)
		}
	}

	let handleRemove = (idx: number) => {
		setMembershipStore(
			produce((s) => {
				s.items.splice(idx, 1)
			}),
		)
	}

	let isDisabled = createMemo(() => {
		let type = M.getValue(props.formStore, "data.artist_type")
		return !type || type == "Unknown"
	})
	return (
		<div class="flex min-h-32 w-96 flex-col">
			<div class="mb-4 flex place-content-between items-center gap-4">
				<FormComp.Label class="m-0">Membership</FormComp.Label>
				<div class="flex gap-2">
					<ArtistSearchDialog
						onSelect={handleSelect}
						disabled={isDisabled()}
					/>
				</div>
			</div>
			<ul class="flex h-full flex-col gap-2">
				<For
					each={membershipStore.items}
					fallback={<FieldArrayFallback />}
				>
					{(artist, idx) => {
						// onMount(() => {
						// 	// @ts-expect-error
						// 	M.setValues(props.formStore, `data.memberships.${idx()}.tenure`, [
						// 		undefined,
						// 	])
						// 	// @ts-expect-error
						// 	M.setValues(props.formStore, `data.memberships.${idx()}.roles`, [
						// 		undefined,
						// 	])
						// })
						return (
							<>
								<MembershipListItem
									formStore={props.formStore}
									index={idx()}
									onRemove={() => handleRemove(idx())}
									artist={artist}
								/>
								{idx() < membershipStore.items.length - 1 && (
									<Divider horizonal />
								)}
							</>
						)
					}}
				</For>
			</ul>
		</div>
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

type MembershipListItemProps = {
	formStore: M.FormStore<NewArtistCorrection>
	index: number
	onRemove: () => void
	artist: Artist
}

function MembershipListItem(props: MembershipListItemProps) {
	return (
		<li class="grid grid-cols-[1fr_auto] gap-2">
			<M.Field
				of={props.formStore}
				name={`data.memberships.${props.index}.artist_id`}
				type="number"
			>
				{(field, fieldProps) => (
					<>
						<input
							{...fieldProps}
							type="number"
							hidden
							value={field.value}
						/>
						<div class="flex items-center">{props.artist.name}</div>
					</>
				)}
			</M.Field>

			<InputField.Root class="row-start-2">
				<InputField.Input
					id={`memberships.${props.index}.roles`}
					placeholder="Role IDs, e.g. `1,2,3`"
					onChange={(e) => {
						const value = e.target.value
						const result = value.split(",").map((v) => {
							return Number.parseInt(v, 10)
						})
						M.setValues(
							props.formStore,
							`data.memberships.${props.index}.roles`,
							result,
						)
					}}
				/>
				{/* <InputField.Error message={} /> */}
			</InputField.Root>

			<TenureField
				index={props.index}
				formStore={props.formStore}
			/>

			<Button
				variant="Tertiary"
				size="Sm"
				class="col-start-2 row-span-3"
				onClick={props.onRemove}
			>
				<Cross1Icon />
			</Button>
		</li>
	)
}

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
