import { useQuery } from "@tanstack/solid-query"
import { createFileRoute } from "@tanstack/solid-router"
import * as v from "valibot"

import { EntityId } from "~/api/shared/schema"
import { SongQueryOption } from "~/api/song"
import { TanstackQueryClinet } from "~/state/tanstack"
import { SongInfoPage } from "~/views/song/Info"

export const Route = createFileRoute("/song/$id")({
	component: RouteComponent,
	loader: async ({ params }) => {
		const parsedId = v.parse(EntityId, Number.parseInt(params.id, 10))
		return await TanstackQueryClinet.ensureQueryData(
			SongQueryOption.findById(parsedId),
		)
	},

	// Optional: Add error component and pending component as in artist route if desired
	// errorComponent: () => <Navigate to="/" />,
	// pendingComponent: () => <div>Loading song...</div>,
})

function RouteComponent() {
	const params = Route.useParams()
	const songId = Number.parseInt(params().id, 10)
	const query = useQuery(() => SongQueryOption.findById(songId))

	return (
		<>
			<SongInfoPage song={query.data!} />
		</>
	)
}
