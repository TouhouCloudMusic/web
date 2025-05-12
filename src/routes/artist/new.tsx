import { createFileRoute } from "@tanstack/solid-router"
import Form from "~/views/artist/edit"

export const Route = createFileRoute("/artist/new")({
	component: RouteComponent,
})

function RouteComponent() {
	return <Form type="new" />
}
