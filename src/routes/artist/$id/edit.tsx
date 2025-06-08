import { useQuery } from "@tanstack/solid-query"
import { createFileRoute } from "@tanstack/solid-router"
import * as v from "valibot"

import { ArtistQueryOption } from "~/api/artist"
import { EntityId } from "~/api/shared/schema"
import { TanstackQueryClinet } from "~/state/tanstack"
import { EditArtistPage } from "~/views/artist/edit"

export const Route = createFileRoute("/artist/$id/edit")({
	component: RouteComponent,
	loader: async ({ params: { id } }) => {
		const parsedId = v.parse(EntityId, Number.parseInt(id, 10))

		return await TanstackQueryClinet.ensureQueryData(
			ArtistQueryOption.findById(parsedId),
		)
	},
})

function RouteComponent() {
	const params = Route.useParams()
	const id = params().id
	const parsedId = v.parse(EntityId, Number.parseInt(id, 10))
	const query = useQuery(() => ArtistQueryOption.findById(parsedId))

	if (!query.data) {
		return null
	}

	return <EditArtistPage type="edit" artist={query.data} />
} 