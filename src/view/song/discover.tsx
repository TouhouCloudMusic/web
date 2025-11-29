import { useLingui } from "@lingui-solid/solid/macro"
import { getRouteApi } from "@tanstack/solid-router"
import {
	createSolidTable,
	getCoreRowModel,
	TableOptions,
} from "@tanstack/solid-table"
import type { Song } from "@thc/api"
import { createSignal, For, Match, Show, Switch } from "solid-js"
import { MagnifyingGlassIcon } from "solid-radix-icons"

import { Pagination } from "~/component/Pagination"
import { Table } from "~/component/Table"
import { FormComp, Link } from "~/component/atomic"
import { Input } from "~/component/atomic/Input"
import { Button } from "~/component/atomic/button"
import { PageLayout } from "~/layout"

const route = getRouteApi("/song/")

export const SongDiscover = () => {
	const loadData = route.useLoaderData()
	const { i18n } = useLingui()
	// NOTE: mock
	const [page, setPage] = createSignal(1)
	const [input, setInput] = createSignal("")

	const option = {
		data: loadData(),
		columns: [
			{
				id: "localized_titles",
				header: "",
				accessorFn: (row) => [
					row.localized_titles?.find((v) => v.language.code == i18n().locale)
						?.title,
					row.title,
				],
				cell: (c) => (
					<p class="flex gap-4">
						<Link
							to="/song/$id"
							params={{
								id: "0",
							}}
						>
							<Switch fallback={c.getValue()[1]}>
								<Match when={c.getValue()[0]}>{c.getValue()[0]}</Match>
							</Switch>
						</Link>
						<Show when={c.getValue()[0]}>
							<span class="text-secondary">{c.getValue()[1]}</span>
						</Show>
					</p>
				),
			},
			{
				id: "credits",
				header: "",
				accessorFn: (row) => {
					if (!row.credits) return []
					// NOTE: mock
					return row.credits
						.filter(
							(c) =>
								c.role?.name == "Original Composer"
								|| c.role?.name == "Composer",
						)
						.map((c) => c.artist.name)
				},
				cell: (c) => (
					<ul class="flex gap-2">
						<For each={c.getValue()}>{(c) => <li>{c}</li>}</For>
					</ul>
				),
			},
		],
		getCoreRowModel: getCoreRowModel(),
	} satisfies TableOptions<Song>

	const table = createSolidTable<Song>(option)

	return (
		<PageLayout>
			<div class="flex flex-col gap-2 p-6">
				<h2 class="text-xl font-bold text-slate-800">曲库</h2>
				<form
					class="flex gap-2"
					onSubmit={(e) => {
						e.preventDefault()
						const data = new FormData(e.currentTarget)
						console.log(data.get("search_song"))
					}}
				>
					<Input
						placeholder={"搜索歌曲"}
						name="search_song"
						oninput={(e) => setInput(e.target.value)}
					/>
					<Button
						size="Md"
						variant="Tertiary"
						type="submit"
					>
						<MagnifyingGlassIcon />
					</Button>
				</form>
				<Table table={table} />
				<Pagination
					page={page}
					setPage={setPage}
					total={10}
					class="mx-auto mt-10"
				/>
			</div>
		</PageLayout>
	)
}
