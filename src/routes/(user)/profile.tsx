import { createFileRoute } from "@tanstack/solid-router"
import { createResource, Suspense } from "solid-js"
import { AuthGuard } from "~/components/route"
import { userProfileQuery } from "~/data/user"
import { Profile } from "~/views/user/Profile"

export const Route = createFileRoute("/(user)/profile")({
	component: RouteComponent,
})

function RouteComponent() {
	const queryResult = userProfileQuery({ "params.username": undefined })

	const [data] = createResource(() => queryResult.promise)
	return (
		<AuthGuard>
			<Suspense fallback={<div>123123</div>}>
				<Profile
					isCurrentUser={true}
					data={data}
				/>
			</Suspense>
		</AuthGuard>
	)
}
