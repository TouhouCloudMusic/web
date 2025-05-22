import { useQuery } from "@tanstack/solid-query"
import { createFileRoute, Navigate } from "@tanstack/solid-router"
import * as v from "valibot"

import { ArtistQuery } from "~/api/artist"
import { EntityId } from "~/api/share/schema"
import { TanstackQueryClinet } from "~/state/tanstack"
import { ArtistProfile } from "~/views/artist/profile"

export const Route = createFileRoute("/artist/(profile)/$id")({
	component: RouteComponent,
	loader: async ({ params: { id } }) => {
		const parsed = v.parse(EntityId, Number.parseInt(id, 10))

		return await TanstackQueryClinet.ensureQueryData(
			ArtistQuery.findByIdOption(parsed),
		)
	},
	errorComponent: () => {
		return <Navigate to="/" />
	},
})

function RouteComponent() {
	const params = Route.useParams()
	const query = useQuery(() =>
		ArtistQuery.findByIdOption(Number.parseInt(params().id, 10)),
	)

	return (
		<>
			<ArtistProfile artist={query.data} />
		</>
	)
}
