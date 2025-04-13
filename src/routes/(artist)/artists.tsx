
//!!WIP Project!!

import { createFileRoute } from '@tanstack/solid-router'
import { Title } from '@solidjs/meta'
//import { artistProfileQuery } from '~/data/artist'
import { ArtistProfile } from '~/views/artist/artistProfile'
import { Button } from "~/components/button"
import { Show } from 'solid-js'
import { PageLayout } from '~/components/layout/PageLayout'

export const Route = createFileRoute('/(artist)/artists')({
  component: RouteComponent
})


// Assuming artistProfileQuery is defined somewhere like this:

function RouteComponent() {
  return(
    <PageLayout>
      <ArtistProfile /> 
    </PageLayout>
  )
}