
//!!WIP Project!!

import { createFileRoute } from '@tanstack/solid-router'
import { Title } from '@solidjs/meta'
import { artistProfileQuery } from '~/data/artist'
import { Button } from "~/components/button"
import { Show } from 'solid-js'
import { FetchClient } from '~/data'

export const Route = createFileRoute('/artists')({
  component: RouteComponent
})

interface Artist {
  name: string;
  // other artist properties...
}

interface ArtistQueryResult {
  status: 'ok' | 'error';
  data: Artist;
}

// Assuming artistProfileQuery is defined somewhere like this:
declare function artistProfileQuery(params: { id: number }): ArtistQueryResult;

function RouteComponent() {
  const artistQuery = artistProfileQuery({ id: 1 });
  
  return (
    <div>
      Hello "/artists"!
        {/* <p><button onClick={() => postTest()}>Test Post</button></p> */}
      <Show
        when={artistQuery.isSuccess}
        fallback={<div>Loading...</div>}
      >
        <div>{artistQuery.data?.name ?? 'Unknown Artist'}</div>
      </Show>
      <Show when={artistQuery.isError}>
        <div>Error loading artist</div>
      </Show>
    </div>
  );
}