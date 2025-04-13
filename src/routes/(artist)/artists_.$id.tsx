// routes/(artist)/[id].tsx
import { createFileRoute } from "@tanstack/solid-router";
import { ArtistProfile } from "~/views/artist/artistProfile";

export const Route = createFileRoute('/(artist)/artists_/$id')({
  component: ArtistPage,
});

function ArtistPage() {
  return <ArtistProfile />;
}