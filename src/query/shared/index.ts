export type Pagination = {
	cursor: number
	limit: number
}

export type Paginated<T> = {
	items: T[]
	next_cursor?: number | null
}
