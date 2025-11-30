import { Pagination as K_Pagination } from "@kobalte/core/pagination"
import { Accessor, Component, Setter } from "solid-js"
import { twMerge } from "tailwind-merge"

const PAGINATER_CLASS = "*:inline-flex *:items-center *:justify-between *:gap-2"
const ITEM_CLASS =
	"inline-flex h-9 items-center justify-center rounded-md px-3 tabular-nums hover:bg-secondary"

type PaginationProps = {
	page: Accessor<number>
	setPage: Setter<number>
	total: number
	class?: string
}

export const Pagination: Component<PaginationProps> = (props) => {
	const paginaterClass = () => twMerge(PAGINATER_CLASS, props.class)

	return (
		<K_Pagination
			count={props.total}
			page={props.page()}
			onPageChange={props.setPage}
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
