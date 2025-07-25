import { useQuery } from "@tanstack/solid-query"
import { createFileRoute } from "@tanstack/solid-router"
import type { Release } from "~/api/release"
import { ReleaseQueryOption } from "~/api/release"
import { TanstackQueryClinet } from "~/state/tanstack"
import { ReleaseInfoPage } from "~/views/song/release"
// import * as v from "valibot"

export const Route = createFileRoute("/release/$keyword")({
	component: RouteComponent,
	loader: async ({ params }) => {
		const parsedKeyword = params.keyword
		return await TanstackQueryClinet.ensureQueryData(
			ReleaseQueryOption.findByKeyword(parsedKeyword),
		)
	},

	// errorComponent: () => <Navigate to="/" />,
	// pendingComponent: () => <div>Loading release...</div>,
})

function RouteComponent() {
	const params = Route.useParams()
	const query = useQuery(() => ReleaseQueryOption.findByKeyword(params().keyword))

	// use the first release found for this keyword
	const release = () => {
		const releases = query.data
		if (Array.isArray(releases) && releases.length > 0) {
			return releases[0]
		}
		return releases // In case the API returns a single release object
	}

	// loading state while fetching
	// if (query.isLoading) {
	// 	return <div class="p-8 text-center">Loading release...</div>
	// }

	// error state if no release found
	if (!release()) {
		return <div class="p-8 text-center">No release found for "{params().keyword}"</div>
	}

	return (
		<ReleaseInfoPage release={release() as Release} keyword={params().keyword} />
	)
}