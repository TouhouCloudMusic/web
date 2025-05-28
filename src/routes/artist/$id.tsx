import { useInfiniteQuery, useQuery } from "@tanstack/solid-query"
import { createFileRoute } from "@tanstack/solid-router"
import { createEffect } from "solid-js"
import { createStore, produce } from "solid-js/store"
import * as v from "valibot"

import type { ArtistRelease } from "~/api/artist"
import { ArtistQueryOption } from "~/api/artist"
import type { ReleaseType } from "~/api/release"
import { RELEASE_TYPES } from "~/api/release"
import { EntityId } from "~/api/shared/schema"
import { TanstackQueryClinet } from "~/state/tanstack"
import { Obj, Str } from "~/utils/data"
import { ArtistProfilePage } from "~/views/artist/profile"

export const Route = createFileRoute("/artist/$id")({
	component: RouteComponent,
	loader: async ({ params: { id } }) => {
		const parsedId = v.parse(EntityId, Number.parseInt(id, 10))

		return await TanstackQueryClinet.ensureQueryData(
			ArtistQueryOption.findById(parsedId),
		)
	},
	// errorComponent: () => {
	// 	return <Navigate to="/" />
	// },
})

// oxlint-disable-next-line max-lines-per-function
function RouteComponent() {
	const params = Route.useParams()
	const artistId = Number.parseInt(params().id, 10)
	const query = useQuery(() => ArtistQueryOption.findById(artistId))

	const initAppearances = useInfiniteQuery(() =>
		ArtistQueryOption.appearances(artistId),
	)

	const initCredits = useInfiniteQuery(() =>
		ArtistQueryOption.credits(artistId),
	)

	// Discographies

	const initDiscographies = useQuery(() =>
		ArtistQueryOption.discographyInit(artistId),
	)

	const [discographyMap, setDiscographyMap] = createStore(
		Obj.fromEntries(RELEASE_TYPES.map((ty) => [ty, [] as ArtistRelease[]])),
	)
	createEffect(() => {
		if (!initDiscographies.data) return

		for (const type of RELEASE_TYPES) {
			const initData = initDiscographies.data[Str.toLowerCase(type)].items

			setDiscographyMap(
				produce((v) => {
					v[type] = initData
				}),
			)
		}
	})

	const [enabled, setEnabled] = createStore(
		Obj.fromEntries(RELEASE_TYPES.map((type) => [type, false])),
	)

	const discography = Obj.fromEntries(
		RELEASE_TYPES.map((type) => [
			type,
			useInfiniteQuery(() =>
				Obj.merge(ArtistQueryOption.discography(artistId, type), {
					enabled: () => enabled[type],
					initialPageParam:
						initDiscographies.data?.[Str.toLowerCase(type)].next_cursor ?? 0,
					getNextPageParam: (last) => {
						if (!initDiscographies.data?.[Str.toLowerCase(type)].next_cursor)
							return
						return last.next_cursor
					},
				}),
			),
		]),
	)

	return (
		<>
			<ArtistProfilePage
				artist={query.data!}
				appearances={{
					get data() {
						return initAppearances.data?.pages.flatMap((p) => p.items) ?? []
					},
					get hasNext() {
						return initAppearances.hasNextPage
					},
					async next() {
						await initAppearances.fetchNextPage()
						return
					},
				}}
				credits={{
					get data() {
						return initCredits.data?.pages.flatMap((p) => p.items) ?? []
					},
					get hasNext() {
						return initCredits.hasNextPage
					},
					async next() {
						await initCredits.fetchNextPage()
						return
					},
				}}
				discographies={{
					get data() {
						return discographyMap
					},
					hasNext(type: ReleaseType) {
						return discography[type].hasNextPage
					},
					async next(type: ReleaseType): Promise<void> {
						setEnabled(type, true)
						if (discography[type].isFetchingNextPage) return

						let res = await discography[type].fetchNextPage()
						if (!res.data) return
						setDiscographyMap(
							produce((v) => {
								v[type].push(...res.data.pages.flatMap((p) => p.items))
							}),
						)
					},
				}}
			/>
		</>
	)
}
