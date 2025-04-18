import { createFileRoute } from '@tanstack/solid-router'
import Release from '../views/song/release'

export const Route = createFileRoute('/release/$keyword')({
  component: RouteComponent,
})

function RouteComponent() {
  const params = Route.useParams()()
  // console.log(params.keyword)
  return <Release keyword={params.keyword}/>
}
