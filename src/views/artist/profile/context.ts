import { createContext } from "solid-js"

import type { Artist } from "~/api/artist"

export type ArtistContext = {
	artist: Artist
}

export const ArtistContext = createContext<ArtistContext>()
