import { createFileRoute } from "@tanstack/solid-router";
import { ArtistProfile } from "~/views/artist/artistProfile";

export const Route = createFileRoute('/(artist)/artists_/$id')({
  component: ArtistPage,
});

function ArtistPage() {
  const params = Route.useParams();
  const id = () => Number(params().id);

  return (
    <div>
      <ArtistProfile id={id()} />
    </div>
  );
}