import { createFileRoute } from "@tanstack/solid-router"
import { UserQuery } from "@thc/query"
import { createResource } from "solid-js"

import { QUERY_CLIENT } from "~/state/tanstack"
import { Profile } from "~/views/user/Profile"

export const Route = createFileRoute("/(user)/profile_/$username")({
	component: RouteComponent,
	loader: ({ params: { username } }) =>
		QUERY_CLIENT.ensureQueryData(
			UserQuery.profileOption({
				"params.username": username,
			}),
		),
})

function RouteComponent() {
	const parmas = Route.useParams()
	const queryResult = UserQuery.profile({
		"params.username": parmas().username,
	})

	const [data] = createResource(() => queryResult.promise)
	return (
		<Profile
			isCurrentUser={false}
			data={data}
		/>
	)
}
