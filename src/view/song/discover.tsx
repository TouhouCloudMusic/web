import { useLingui } from "@lingui-solid/solid/macro"
import { getRouteApi, useNavigate } from "@tanstack/solid-router"
import {
	type CellContext,
	createSolidTable,
	getCoreRowModel,
	type TableOptions,
} from "@tanstack/solid-table"
import type { SimpleArtist, Song } from "@thc/api"
import { type Component, For, Show } from "solid-js"

import { Pagination } from "~/component/Pagination"
import { Table } from "~/component/Table"
import { Link } from "~/component/atomic"
import { PageLayout } from "~/layout"

const route = getRouteApi("/song/")

type TitleCellProps = {
	localized_titles?: string
	title: string
	id: number
}

const TitleCell: Component<TitleCellProps> = (props) => {
	const displayTitle = () => props.localized_titles ?? props.title

	return (
		<p class="flex gap-4">
			<Link
				to="/song/$id"
				params={{
					id: props.id.toString(),
				}}
			>
				{displayTitle()}
			</Link>
			<Show when={props.localized_titles}>
				<span class="text-secondary">{props.title}</span>
			</Show>
		</p>
	)
}

type ArtistCellProps = {
	artist: SimpleArtist[]
}

const ArtistCell: Component<ArtistCellProps> = (props) => {
	return (
		<ul class="flex gap-2">
			<For each={props.artist}>{(c) => <li>{c.name}</li>}</For>
		</ul>
	)
}

export const SongDiscover = () => {
	const loadData = route.useLoaderData()

	const songs = () => loadData().songs
	const pagination = () => loadData().pagination

	const { i18n } = useLingui()

	const navigate = useNavigate({ from: "/song" })
	const navigateBySongId = (page: number) => {
		navigate({
			to: "/song",
			search: {
				page,
				size: pagination().size,
			},
		})
	}

	/**
	 * TODO:
	 * 具体 columns 数据选择有待商榷，目前只展示两列：
	 * Title:
	 *   - 若无 localized_titles 则展示 title
	 *   - 若存在与用户当前 locale 匹配的 localized_titles
	 *     则正常文本样式展示 localized_titles，并在其右边采用次要
	 *     文本样式展示 title
	 *   - 作为 Link 跳转对应 /song/$id
	 * Credits/Artists:
	 *   - 展示 song 相应的 credits/artists 列表
	 *   - (WIP) 作为 Link 跳转对应 /artist/$id
	 */
	const option = {
		data: songs(),
		columns: [
			{
				id: "localized_titles",
				header: "歌曲名",

				accessorFn: (row): TitleCellProps => {
					const localized = row.localized_titles?.find(
						(v) => v.language.code === i18n().locale,
					)?.title

					return {
						localized_titles: localized,
						title: row.title,
						id: row.id,
					}
				},

				cell: (c: CellContext<Song, TitleCellProps>) => {
					return <TitleCell {...c.getValue()} />
				},
			},
			{
				id: "credits",
				header: "创作者",

				accessorFn: (row): ArtistCellProps => {
					if (!row.credits) return { artist: [] }

					const artist = row.credits
						.filter(
							(c) =>
								c.role?.name === "Original Composer"
								|| c.role?.name === "Composer",
						)
						.map((c) => c.artist)

					// NOTE: mock
					return { artist }
				},

				cell: (c: CellContext<Song, ArtistCellProps>) => {
					return <ArtistCell {...c.getValue()} />
				},
			},
		],
		getCoreRowModel: getCoreRowModel(),
	} satisfies TableOptions<Song>

	const table = createSolidTable<Song>(option)

	return (
		<PageLayout>
			<div class="flex flex-col gap-2 p-6">
				<h2 class="text-xl font-bold text-slate-800">曲库</h2>
				<Table table={table} />
				<Pagination
					current={pagination().page}
					onPageChange={navigateBySongId}
					total={pagination().total}
					class="mx-auto mt-10"
				/>
			</div>
		</PageLayout>
	)
}
