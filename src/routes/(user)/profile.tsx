import { createFileRoute } from "@tanstack/solid-router"
import { AuthGuard } from "~/components/route"
import { Profile } from "~/views/user/Profile"

export const Route = createFileRoute("/(user)/profile")({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <AuthGuard>
      <Profile />
    </AuthGuard>
  )
}
