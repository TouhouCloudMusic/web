import { createFileRoute, useParams } from "@tanstack/solid-router"
import { AuthGuard } from "~/components/route"
import { Resource } from "~/data"
import { userProfileQuery } from "~/data/user"
import { Profile } from "~/views/user/Profile"

export const Route = createFileRoute("/(user)/profile")({
	component: RouteComponent,
})

function RouteComponent() {
	const queryResult = userProfileQuery({ "params.username": undefined })

	return (
		<AuthGuard>
			<Profile
				isCurrentUser={true}
				data={
					// Resource.fromQueryResult(queryResult)
					Resource.Loading()
				}
			/>
		</AuthGuard>
	)
}
