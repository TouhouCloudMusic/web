import { Trans, useLingui } from "@lingui-solid/solid/macro"
import { useQuery } from "@tanstack/solid-query"
import type { CreditRoleRef } from "@thc/api"
import { CreditRoleQueryOption } from "@thc/query"
import { debounce, id } from "@thc/toolkit"
import { createMemo, createSignal, Suspense, For } from "solid-js"
import type { JSX } from "solid-js"
import { PlusIcon } from "solid-radix-icons"

import { Button } from "~/component/atomic/button"
import { Dialog } from "~/component/dialog"

import * as SearchDialog from "./__internal"

type Props = {
	onSelect: (role: CreditRoleRef) => void
	disabled?: boolean
}

export function CreditRoleSearchDialog(props: Props): JSX.Element {
	const { t } = useLingui()
	const [searchKeyword, setSearchKeyword] = createSignal("")

	const onInput = debounce(300, (e: Event) => {
		setSearchKeyword((e.target as HTMLInputElement).value)
	})

	const searchTerm = createMemo(() => {
		const keyword = searchKeyword().trim()
		return keyword.length > 0 ? keyword : ""
	})

	const rolesQuery = useQuery(() => ({
		...CreditRoleQueryOption.findByKeyword(searchTerm()),
		placeholderData: id,
	}))

	return (
		<SearchDialog.Root>
			<Dialog.Trigger
				as={Button}
				variant="Tertiary"
				class="h-max p-2"
				disabled={props.disabled}
			>
				<PlusIcon class="size-4 text-slate-600" />
			</Dialog.Trigger>

			<SearchDialog.Content>
				<div class="mb-6 space-y-4">
					<SearchDialog.Label>
						<Trans>Search Role</Trans>
					</SearchDialog.Label>
					<SearchDialog.Input
						placeholder={t`Search...`}
						value={searchKeyword()}
						onInput={onInput}
						class="h-9 w-full"
					/>
				</div>

				<SearchDialog.List>
					<Suspense>
						<For each={rolesQuery.data}>
							{(role) => (
								<SearchDialog.Item>
									<SearchDialog.ItemIndicator />
									<button
										type="button"
										class="w-full"
										onClick={() => props.onSelect(role)}
									>
										<div class="flex items-center justify-between">
											<div class="text-left text-lg font-light text-primary">
												{role.name}
											</div>
											<div class="opacity-0 transition-opacity duration-150 group-hover:opacity-100">
												<PlusIcon class="size-4 text-tertiary" />
											</div>
										</div>
									</button>
								</SearchDialog.Item>
							)}
						</For>
					</Suspense>
				</SearchDialog.List>
			</SearchDialog.Content>
		</SearchDialog.Root>
	)
}
