import { createFileRoute } from "@tanstack/solid-router"
import type { Song } from "@thc/api"
import * as v from "valibot"

import { createMockSongs } from "~/mock/song"
import { SongDiscover } from "~/view/song/discover"

// NOTE: mock
const DEFAULT_PAGI_PAGE = 1
const DEFAULT_PAGI_SIZE = 10

/**
 * TODO:
 * 需要后端确认具体字段以及 fallback
 */
const paginationSearch = v.object({
	page: v.fallback(v.pipe(v.number(), v.minValue(1)), DEFAULT_PAGI_PAGE),
	size: v.fallback(v.pipe(v.number(), v.minValue(1)), DEFAULT_PAGI_SIZE),
})

type PaginationSearch = v.InferInput<typeof paginationSearch>

/**
 * TODO:
 * 需要确认后端返回的字段
 */
type PaginationData = PaginationSearch & { total: number }

type LoaderData = {
	songs: Song[]
	pagination: PaginationData
}

export const Route = createFileRoute("/song/")({
	component: SongDiscover,
	validateSearch: paginationSearch,
	loaderDeps: ({ search }) => search,
	loader: async ({ deps }): Promise<LoaderData> => {
		// NOTE: fetch from endpoint
		const MOCK_TOTAL = 10
		const songs = createMockSongs(deps.size, (deps.page - 1) * deps.size + 1)

		return {
			songs,
			pagination: { ...deps, total: MOCK_TOTAL },
		}
	},
})
