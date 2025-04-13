import { createFileRoute } from '@tanstack/solid-router'

export const Route = createFileRoute('/(artist)/artists_/edit')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/artists_/edit"!</div>
}
