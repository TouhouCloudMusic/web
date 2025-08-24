import { useQuery } from "@tanstack/solid-query"
import { createFileRoute, useNavigate } from "@tanstack/solid-router"
import { createEffect } from "solid-js"
import * as v from "valibot"

import { EntityId } from "~/domain/shared"
import { ArtistQueryOption } from "~/query/artist"
import { QUERY_CLIENT } from "~/state/tanstack"
import { EditArtistPage } from "~/views/artist/edit"

export const Route = createFileRoute("/artist/$id/edit")({
	component: RouteComponent,
	loader: async ({ params: { id } }) => {
		const parsedId = v.parse(EntityId, Number.parseInt(id, 10))

		return await QUERY_CLIENT.ensureQueryData(
			ArtistQueryOption.findById(parsedId),
		)
	},
})

function RouteComponent() {
	const params = Route.useParams()
	const id = params().id
	const parsedId = v.parse(EntityId, Number.parseInt(id, 10))
	const query = useQuery(() => ArtistQueryOption.findById(parsedId))

	const nav = useNavigate()
	createEffect(() => {
		if (!query.data && !query.isPending) {
			// TODO: Show error message
			void nav({
				to: "/",
			})
		}
	})

	return (
		<EditArtistPage
			type="edit"
			artist={query.data!}
		/>
	)
}
