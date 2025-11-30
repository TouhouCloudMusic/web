import { Pagination as K_Pagination } from "@kobalte/core/pagination"
import { Component } from "solid-js"
import { twMerge } from "tailwind-merge"

import { tw } from "~/utils"

const PAGINATER_CLASS = "*:inline-flex *:items-center *:justify-between *:gap-2"
const ITEM_CLASS = tw(`
	inline-flex
    items-center
    justify-center
    h-9
    px-3
    rounded-md
    tabular-nums
    hover:bg-secondary

    data-current:bg-slate-900
    data-current:hover:bg-slate-900
    data-current:text-(--background-color-primary)
    data-current:active:bg-slate-800
    data-current:disabled:bg-slate-800
`)

type PaginationProps = {
	current: number
	onPageChange: (page: number) => void
	total: number
	class?: string
}

export const Pagination: Component<PaginationProps> = (props) => {
	const paginaterClass = () => twMerge(PAGINATER_CLASS, props.class)

	return (
		<K_Pagination
			count={props.total}
			page={props.current}
			onPageChange={props.onPageChange}
			itemComponent={(p) => (
				<K_Pagination.Item
					page={p.page}
					class={ITEM_CLASS}
				>
					{p.page}
				</K_Pagination.Item>
			)}
			ellipsisComponent={() => (
				<K_Pagination.Ellipsis>...</K_Pagination.Ellipsis>
			)}
			class={paginaterClass()}
		>
			<K_Pagination.Previous class={ITEM_CLASS}>Prev</K_Pagination.Previous>
			<K_Pagination.Items />
			<K_Pagination.Next class={ITEM_CLASS}>Next</K_Pagination.Next>
		</K_Pagination>
	)
}
