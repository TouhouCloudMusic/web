import { useInfiniteQuery, useQuery } from "@tanstack/solid-query"
import { createFileRoute } from "@tanstack/solid-router"
import * as v from "valibot"

import { ArtistQueryOption } from "~/api/artist"
import type { ReleaseType } from "~/api/release"
import { EntityId } from "~/api/shared/schema"
import { TanstackQueryClinet } from "~/state/tanstack"
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

	const initDiscographyAlbum = useInfiniteQuery(() =>
		ArtistQueryOption.discography(artistId, "Album"),
	)
	const initDiscographyEP = useInfiniteQuery(() =>
		ArtistQueryOption.discography(artistId, "Ep"),
	)

	const initDiscographySingle = useInfiniteQuery(() =>
		ArtistQueryOption.discography(artistId, "Single"),
	)

	const initDiscographyCompilation = useInfiniteQuery(() =>
		ArtistQueryOption.discography(artistId, "Compilation"),
	)

	const initDiscographyDemo = useInfiniteQuery(() =>
		ArtistQueryOption.discography(artistId, "Demo"),
	)

	const initDiscographyOther = useInfiniteQuery(() =>
		ArtistQueryOption.discography(artistId, "Other"),
	)

	const initDiscographies = [
		initDiscographyAlbum,
		initDiscographyEP,
		initDiscographySingle,
		initDiscographyCompilation,
		initDiscographyDemo,
		initDiscographyOther,
	]

	const initAppearances = useInfiniteQuery(() =>
		ArtistQueryOption.appearances(artistId),
	)

	const initCredits = useInfiniteQuery(() =>
		ArtistQueryOption.credits(artistId),
	)

	const discographies = {
		get data() {
			return initDiscographies.flatMap((q) =>
				q.data!.pages.flatMap((p) => p.items),
			)
		},
		hasNext(type: ReleaseType) {
			// oxlint-disable-next-line default-case
			switch (type) {
				case "Album":
					return initDiscographyAlbum.hasNextPage
				case "Ep":
					return initDiscographyEP.hasNextPage
				case "Single":
					return initDiscographySingle.hasNextPage
				case "Compilation":
					return initDiscographyCompilation.hasNextPage
				case "Demo":
					return initDiscographyDemo.hasNextPage
				case "Other":
					return initDiscographyOther.hasNextPage
			}
		},
		async next(type: ReleaseType): Promise<void> {
			// oxlint-disable-next-line default-case
			switch (type) {
				case "Album":
					if (initDiscographyAlbum.isFetchingNextPage) {
						return
					}
					await initDiscographyAlbum.fetchNextPage()
					return
				case "Ep":
					if (initDiscographyEP.isFetchingNextPage) {
						return
					}
					await initDiscographyEP.fetchNextPage()
					return
				case "Single":
					if (initDiscographySingle.isFetchingNextPage) {
						return
					}
					await initDiscographySingle.fetchNextPage()
					return
				case "Compilation":
					if (initDiscographyCompilation.isFetchingNextPage) {
						return
					}
					await initDiscographyCompilation.fetchNextPage()
					return
				case "Demo":
					if (initDiscographyDemo.isFetchingNextPage) {
						return
					}
					await initDiscographyDemo.fetchNextPage()
					return
				case "Other":
					if (initDiscographyOther.isFetchingNextPage) {
						return
					}
					await initDiscographyOther.fetchNextPage()
					return
			}
		},
	}

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
				discographies={discographies}
			/>
		</>
	)
}
