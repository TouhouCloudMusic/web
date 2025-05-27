// oxlint-disable-next-line export
export * from "./schema"
export * as DateWithPrecision from "./__internal/date_with_prec"

export type Pagination = {
	cursor: number
	limit: number
}
