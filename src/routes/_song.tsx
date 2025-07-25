import { createFileRoute } from '@tanstack/solid-router'
import  Song  from '../route/song/index'

export const Route = createFileRoute('/_song')({
  component: RouteComponent,
})

function RouteComponent() {
  return <Song/>
}
