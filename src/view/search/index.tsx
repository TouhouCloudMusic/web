import { useSearch } from "@tanstack/solid-router"

import { PageLayout } from "~/layout/PageLayout"

export function SearchView() {
	const search = useSearch({ from: "/search" })

	return (
		<PageLayout>
			<div class="flex-1 p-6">
				<h1 class="mb-4 text-2xl font-bold text-slate-800">
					搜索结果
				</h1>
				<p class="text-slate-600">
					关键词: <span class="font-semibold">{search().keyword}</span>
				</p>
			</div>
		</PageLayout>
	)
}
