import type { UseQueryResult } from "@tanstack/solid-query"
import { Show } from "solid-js"

import type { Artist } from "~/api/artist"
import { Image } from "~/components/image"
import { PageLayout } from "~/layout/PageLayout"

import { ArtistRelease } from "./comp/ArtistRelease"
import { Info } from "./comp/Info"
import { ArtistContext } from "./context"

export type ArtistProfilePageProps = {
	query: UseQueryResult<Artist>
}

export function ArtistProfilePage(props: ArtistProfilePageProps) {
	return (
		<PageLayout class="p-10">
			{/* TODO: fallback */}
			<Show
				when={props.query.isSuccess && props.query.data}
				fallback={<div>Loading...</div>}
			>
				{(artist) => {
					const contextValue: ArtistContext = {
						get artist() {
							return artist()
						},
					}

					return (
						<ArtistContext.Provider value={contextValue}>
							<div class="grid h-fit grid-cols-[auto_1fr] space-x-8">
								<Image.Root>
									<Image.Fallback>
										{(state) =>
											state == Image.State.Error ?
												<div class="size-64 bg-slate-100"></div>
											:	<></>
										}
									</Image.Fallback>
									<Image.Img src={artist().profile_image_url ?? undefined} />
								</Image.Root>
								<Info />
							</div>
							<ArtistRelease />

							{/* <div class="max-w-full wrap-anywhere">
                {JSON.stringify(props.query.data)}
            </div> */}
						</ArtistContext.Provider>
					)
				}}
			</Show>
		</PageLayout>
	)
}
