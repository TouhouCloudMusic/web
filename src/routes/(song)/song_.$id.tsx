import { createFileRoute } from '@tanstack/solid-router'
import { SongInfo } from '~/views/song/song_info'

export const Route = createFileRoute('/(song)/song_/$id')({
  component: SongInfoPage,
})

function SongInfoPage() {
  const params = Route.useParams();
  const id = () => Number(params().id);

  return (
    <div>
      <SongInfo id={id()} />
    </div>
  );
}


/*
import { createFileRoute } from "@tanstack/solid-router";
import { ArtistProfile } from "~/views/artist/artistProfile";

export const Route = createFileRoute('/(song)/song_/$id')({
  component: ArtistPage,
});

function ArtistPage() {
  const params = Route.useParams();
  const id = () => Number(params().id);

  return (
    <div>
      <songInfo id={id()} />
    </div>
  );
}
  */