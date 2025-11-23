import { useSearch } from "@tanstack/solid-router"
import { useQuery } from "@tanstack/solid-query"
import type { Component } from "solid-js"
import { For, Show } from "solid-js"
import { SearchQueryOption } from "@thc/query"
import { ArtistCard } from "./ArtistCard"
import { SongCard } from "./SongCard"
import { InlineLinks } from "./InlineLinks"
import { LinkButton } from "~/component/atomic/button"
import { ChevronRightIcon } from "solid-radix-icons"

export const GeneralSearchResult: Component = () => {
	const search = useSearch({ from: "/search" })
	const keyword = () => search().keyword ?? ""

	const searchQuery = useQuery(() => SearchQueryOption.search(keyword()))

	return (
		<Show when={searchQuery.isSuccess && searchQuery.data}>
			{(result) => (
				<div class="space-y-2">
					<Show when={result().artists && result().artists.length > 0}>
						<section>
                            <div class="mb-4 flex items-center justify-between">
							    <h2 class="text-lg font-semibold text-slate-800">Artists</h2>
                                <LinkButton variant="Tertiary" href={`/search?type=artist&keyword=${encodeURIComponent(keyword())}`}>
                                    <div class="flex items-center text-sm">View All<ChevronRightIcon class="ml-1 size-4" /></div>
                                </LinkButton>
                            </div>
							<div class="flex gap-4 overflow-x-auto mb-6">
								<For each={result().artists}>
									{(artist) => <ArtistCard artist={artist} />}
								</For>
							</div>
						</section>
					</Show>

					<Show when={result().songs && result().songs.length > 0}>
						<section>
                            <div class="mb-4 flex items-center justify-between">
							    <h2 class="text-lg font-semibold text-slate-800">Songs</h2>
                                <LinkButton variant="Tertiary" href={`/search?type=song&keyword=${encodeURIComponent(keyword())}`}>
                                    <div class="flex items-center text-sm">View All<ChevronRightIcon class="ml-1 size-4" /></div>
                                </LinkButton>
                            </div>
							<div class="grid grid-cols-2 gap-1 mb-6">
								<For each={result().songs}>
									{(song) => {
										return (
											<SongCard
                                                href={`/song/${song.id}`}
												title={song.title}
												artists={
													song.artists && song.artists.length > 0
														? song.artists
														: song.credits?.map((c) => c.artist) ?? []
												}
											>
                                                <InlineLinks items={song.releases?.map(release => ({ text: release.title, link: `/release/${release.id}` })) ?? []} />
											</SongCard>
										)
									}}
								</For>
							</div>
						</section>
					</Show>

					<Show when={result().releases && result().releases.length > 0}>
						<section>
                            <div class="mb-4 flex items-center justify-between">
							    <h2 class="text-lg font-semibold text-slate-800">Releases</h2>
                                <LinkButton variant="Tertiary" href={`/search?type=release&keyword=${encodeURIComponent(keyword())}`}>
                                    <div class="flex items-center text-sm">View All<ChevronRightIcon class="ml-1 size-4" /></div>
                                </LinkButton>
                            </div>
							<div class="grid grid-cols-2 gap-1">
								<For each={result().releases}>
									{(release) => (
										<SongCard
                                            href={`/release/${release.id}`}
                                            title={release.title}
                                            artists={
                                                release.artists && release.artists.length > 0
                                                    ? release.artists
                                                    : release.credits?.map((c) => c.artist) ?? []
                                            }
										>
                                            <span>{release.release_type} • n.d.</span>
                                        </SongCard>
									)}
								</For>
							</div>
						</section>
					</Show>
				</div>
			)}
		</Show>
	)
}
