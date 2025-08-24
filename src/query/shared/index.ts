import type { PaginatedDiscography } from "@thc/api"

export type Pagination = {
	cursor: number
	limit: number
}

export type Paginated<T> = Omit<PaginatedDiscography, "items"> & {
	items: T[]
}
