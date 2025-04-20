import { createAsync } from "@solidjs/router"
import { createFileRoute } from "@tanstack/solid-router"
import { Suspense } from "solid-js"
import { AuthGuard } from "~/components/route"
import { userProfileQuery } from "~/data/user"
import { Profile } from "~/views/user/Profile"

export const Route = createFileRoute("/(user)/profile")({
	component: RouteComponent,
})

function RouteComponent() {
	const queryResult = userProfileQuery({ "params.username": undefined })

	const data = createAsync(() => queryResult.promise)
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
