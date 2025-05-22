import { Suspense } from "solid-js"

import type { Artist } from "~/api/artist"
import { PageLayout } from "~/layout/PageLayout"

export type ArtistProfileProps = {
	artist?: Artist | undefined
}
export function ArtistProfile(props: ArtistProfileProps) {
	return (
		<PageLayout>
			<Suspense fallback={<div>Loading...</div>}>
				{JSON.stringify(props.artist)}
			</Suspense>
		</PageLayout>
	)
}
