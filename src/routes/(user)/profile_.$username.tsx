import { createFileRoute } from "@tanstack/solid-router"
import { Resource } from "~/data"
import { userProfileQuery, userProfileQueryOption } from "~/data/user"
import { TanstackQueryClinet } from "~/state/tanstack"
import { Profile } from "~/views/user/Profile"

export const Route = createFileRoute("/(user)/profile_/$username")({
	component: RouteComponent,
	loader: ({ params: { username } }) =>
		TanstackQueryClinet.ensureQueryData(
			userProfileQueryOption({
				"params.username": username,
			}),
		),
})

function RouteComponent() {
	const parmas = Route.useParams()
	const queryResult = userProfileQuery({
		"params.username": parmas().username,
	})
	return (
		<Profile
			isCurrentUser={false}
			data={Resource.fromQueryResult(queryResult)}
		/>
	)
}
