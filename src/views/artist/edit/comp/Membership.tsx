// @refresh-reload
// oxlint-disable max-lines-per-function
import { useLingui } from "@lingui-solid/solid/macro"
import * as M from "@modular-forms/solid"
import { useQuery } from "@tanstack/solid-query"
import { debounce, id } from "@thc/toolkit"
import { createMemo, createSignal, For, Suspense } from "solid-js"
import type { JSX } from "solid-js"
import { createStore, produce } from "solid-js/store"
import { CheckIcon, Cross1Icon } from "solid-radix-icons"
import * as v from "valibot"

import type { Artist, ArtistCommonFilter } from "~/api/artist"
import type { Tenure } from "~/api/artist/schema"
import { CreditRoleQueryOption } from "~/api/credit"
import type { CreditRoleSummary } from "~/api/credit"
import { Button } from "~/components/button"
import { Combobox } from "~/components/common/Combobox"
import { Intersperse } from "~/components/common/Intersperse"
import { FormComp } from "~/components/common/form"
import { InputField } from "~/components/common/form/Input"
import { Divider } from "~/components/divider"

import { useArtistForm } from "../context"
import { ArtistSearchDialog } from "./ArtistSearchDialog"
import { FieldArrayFallback } from "./FieldArrayFallback"

export function ArtistFormMembership(): JSX.Element {
	let context = useArtistForm()
	let { formStore } = context

	let [membershipStore, setMembershipStore] = createStore([] as Artist[])

	let membership = {
		get inner() {
			return membershipStore
		},
		push: (artist: Artist): void => {
			const exist = membershipStore.some(
				(membership) => membership.id === artist.id,
			)
			if (!exist) {
				setMembershipStore(
					produce((s) => {
						s.push(artist)
					}),
				)
			}
		},
		remove: (idx: number): void => {
			setMembershipStore(
				produce((s) => {
					s.splice(idx, 1)
				}),
			)
		},
	}

	let type = createMemo(() => M.getValue(formStore, "data.artist_type"))

	let isDisabled = createMemo(() => {
		return !type() || type() === "Unknown"
	})

	let exclusion = createMemo(() => {
		let arr = membershipStore.map((x) => x.id)
		if (context.artistId) {
			arr.push(context.artistId)
		}
		return arr
	})

	let filter = createMemo<ArtistCommonFilter>(() => {
		let ty = type()
		return {
			artist_type: ty ? [ty] : undefined,
			exclusion: exclusion(),
		}
	})

	return (
		<div class="flex min-h-32 w-96 flex-col">
			<div class="mb-4 flex place-content-between items-center gap-4">
				<FormComp.Label class="m-0">Membership</FormComp.Label>
				<div class="flex gap-2">
					<ArtistSearchDialog
						onSelect={membership.push}
						disabled={isDisabled()}
						filter={filter()}
					/>
				</div>
			</div>
			<ul class="flex h-full flex-col gap-2">
				<Intersperse
					each={membership.inner}
					separator={<Divider horizonal />}
					fallback={<FieldArrayFallback />}
				>
					{(artist, idx) => (
						<MembershipListItem
							index={idx()}
							onRemove={() => membership.remove(idx())}
							artist={artist}
						/>
					)}
				</Intersperse>
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
	index: number
	onRemove: () => void
	artist: Artist
}

function MembershipListItem(props: MembershipListItemProps) {
	const { formStore } = useArtistForm()
	return (
		<li class="grid grid-cols-[1fr_auto] gap-2">
			<M.Field
				of={formStore}
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

			<MembershipRoleField index={props.index} />

			<TenureField index={props.index} />

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

function TenureField(props: { index: number }) {
	const { formStore } = useArtistForm()
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

export function MembershipRoleField(props: { index: number }): JSX.Element {
	const SEARCH_DEBOUNCE_MS = 300
	const { t } = useLingui()
	const { formStore } = useArtistForm()

	let [searchTerm, setSearchTerm] = createSignal("")

	let searchTermTrimmed = createMemo(() => {
		const kw = searchTerm().trim()
		return kw.length > 1 ? kw : undefined
	})

	let setSearchTermDebounced = debounce(SEARCH_DEBOUNCE_MS, (val: string) =>
		setSearchTerm(val),
	)

	let [roles, setRoles] = createStore<CreditRoleSummary[]>([])

	let rolesQuery = useQuery(() => ({
		...CreditRoleQueryOption.findByKeyword(searchTermTrimmed()!),
		placeholderData: id,
		enabled: Boolean(searchTermTrimmed()?.length),
	}))

	let options = createMemo(() => {
		let data = rolesQuery.isSuccess ? rolesQuery.data : []

		return data.filter((role) => !roles.some((x) => x.id === role.id))
	})

	let path = () => `data.memberships.${props.index}.roles` as const

	let addRole = (role: CreditRoleSummary) => {
		setRoles(
			produce((roles) => {
				roles.push(role)
			}),
		)
		M.insert(formStore, path(), {
			value: role.id,
		})
	}

	let removeRole = (index: number) => {
		setRoles(
			produce((s) => {
				s.splice(index, 1)
			}),
		)
		M.remove(formStore, path(), {
			at: index,
		})
	}

	return (
		<div class="row-start-2">
			<Suspense>
				<Combobox.Root
					options={options()}
					optionValue="id"
					optionTextValue="name"
					open={Boolean(
						rolesQuery.isSuccess &&
							rolesQuery.data.length &&
							rolesQuery.isEnabled,
					)}
					onChange={(role) => {
						if (role) {
							addRole(role)
						}
					}}
					itemComponent={(props) => (
						<Combobox.Item item={props.item}>
							<Combobox.ItemLabel>
								{props.item.rawValue.name}
							</Combobox.ItemLabel>
							<Combobox.ItemIndicator>
								<CheckIcon />
							</Combobox.ItemIndicator>
						</Combobox.Item>
					)}
				>
					<Combobox.Control>
						<Combobox.MultiInputContainer class="flex flex-row flex-wrap gap-1 p-1">
							<For each={roles}>
								{(role, index) => (
									<RoleBadge
										role={role}
										index={index()}
										path={path()}
										removeRole={() => removeRole(index())}
									/>
								)}
							</For>
							<Combobox.MultiInput
								placeholder={t`Search roles...`}
								value={searchTerm()}
								aria-label={t`Search credit role`}
								class="w-fit pl-1"
								onInput={(e) => setSearchTermDebounced(e.currentTarget.value)}
							/>
						</Combobox.MultiInputContainer>
					</Combobox.Control>

					<Combobox.Portal>
						<Combobox.Content>
							<Combobox.Listbox />
						</Combobox.Content>
					</Combobox.Portal>
				</Combobox.Root>
			</Suspense>
		</div>
	)
}

function RoleBadge(props: {
	path: `data.memberships.${number}.roles`
	index: number
	role: CreditRoleSummary
	removeRole: () => void
}) {
	const { t } = useLingui()

	let { formStore } = useArtistForm()
	return (
		<M.Field
			of={formStore}
			name={`${props.path}.${props.index}`}
		>
			{(field, fieldProps) => (
				<li class="flex items-center space-x-1 rounded border border-slate-300 px-2 py-1 hover:border-reimu-600">
					<input
						{...fieldProps}
						type="number"
						hidden
						value={field.value}
					/>
					<span>{props.role.name}</span>
					<button
						type="button"
						class="text-gray-600"
						aria-label={t`Remove role`}
						title={t`Remove role`}
						onClick={() => props.removeRole()}
					>
						<Cross1Icon class="size-4" />
					</button>
				</li>
			)}
		</M.Field>
	)
}
