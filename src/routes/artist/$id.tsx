import { useInfiniteQuery, useQuery } from "@tanstack/solid-query"
import { createFileRoute } from "@tanstack/solid-router"
import * as v from "valibot"

import { ArtistQueryOption } from "~/api/artist"
import { RELEASE_TYPES } from "~/api/release"
import { EntityId } from "~/api/shared/schema"
import { TanstackQueryClinet } from "~/state/tanstack"
import { mapTuple } from "~/utils/data/array"
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

function RouteComponent() {
	const params = Route.useParams()
	const query = useQuery(() =>
		ArtistQueryOption.findById(Number.parseInt(params().id, 10)),
	)

	const initDiscographies = mapTuple(
		(t) =>
			useInfiniteQuery(() => ArtistQueryOption.discography(query.data!.id, t)),
		RELEASE_TYPES,
	)

	const initAppearances = useInfiniteQuery(() =>
		ArtistQueryOption.appearances(query.data!.id),
	)

	const initCredits = useInfiniteQuery(() =>
		ArtistQueryOption.credits(query.data!.id),
	)

	return (
		<>
			<ArtistProfilePage
				artist={query.data!}
				discographies={initDiscographies.flatMap(
					(q) => q.data?.pages.flatMap((p) => p.items) ?? [],
				)}
				appearances={initAppearances.data?.pages.flatMap((p) => p.items) ?? []}
				credits={initCredits.data?.pages.flatMap((p) => p.items) ?? []}
			/>
		</>
	)
}
