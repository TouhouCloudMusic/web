import { useQuery } from "@tanstack/solid-query"
import { createFileRoute, Navigate } from "@tanstack/solid-router"
import * as v from "valibot"

import { ArtistQueryOption } from "~/api/artist"
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

function RouteComponent() {
	const params = Route.useParams()
	const query = useQuery(() =>
		ArtistQueryOption.findById(Number.parseInt(params().id, 10)),
	)

	return (
		<>
			<ArtistProfilePage query={query} />
		</>
	)
}
