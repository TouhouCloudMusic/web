import { createContext } from "solid-js"

import type { Artist, ArtistRelease } from "~/api/artist"

export type ArtistContext = {
	artist: Artist
	discographies: ArtistRelease[]
}

export const ArtistContext = createContext<ArtistContext>()
