import { useSearch } from "@tanstack/solid-router"
import { useQuery } from "@tanstack/solid-query"
import type { Component } from "solid-js"
import { For, Show } from "solid-js"
import { SearchQueryOption } from "@thc/query"
import { ArtistCard } from "../../../component/cards/ArtistCard"
import { SongCard } from "../../../component/cards/SongCard"
import { InlineLinks } from "~/component/atomic/Link"
import { ReleaseCard } from "../../../component/cards/ReleaseCard"
import { CategorySection } from "../../../component/display/CategorySection"
import { PlaylistCard } from "../../../component/cards/PlaylistCard"
import { UserCard } from "../../../component/cards/UserCard"

const mockPlaylists = [
	{
		id: "1",
		title: "La wan Le",
		owner: { id: "u1", name: "fjweoipwo" },
	},
	{
		id: "2",
		title: "Last Playlist",
		owner: { id: "u2", name: "qertvqweqwe" },
	},
	{
		id: "3",
		title: "dfjhgdkjlakjfhlkdfllajshdfks",
		owner: { id: "u1", name: "Alice" },
	},
	{
		id: "4",
		title: "Larem Ipsum Dolor Sit Amet",
		owner: { id: "u2", name: "qwerqwerwq" },
	},
]

const mockUsers = [
	{ id: "u1", name: "Larva", description: "Just a test user." },
	{ id: "u2", name: "Boqb", description: "Another test user." },
	{ id: "u3", name: "dfjhgdkjlakjfhlkdfllajshdfks", description: "Yet another test user." },
	{ id: "u4", name: "aserlaslelasdfhlasdfhkjla", description: "One more test user." },
]

export const GeneralSearchResult: Component = () => {
	const search = useSearch({ from: "/search" })
	const keyword = () => search().keyword ?? ""

	const searchQuery = useQuery(() => SearchQueryOption.search(keyword()))

	return (
		<Show when={searchQuery.isSuccess && searchQuery.data}>
			{(result) => (
				<div class="space-y-2">
					<Show when={result().artists && result().artists.length > 0}>
						<CategorySection title="Artists" viewAllHref={`/search?keyword=${encodeURIComponent(keyword())}&type=artist`}>
							<div class="flex gap-3 overflow-x-auto mb-6">
								<For each={result().artists}>
									{(artist) => <ArtistCard artist={artist} keyword={keyword()} />}
								</For>
							</div>
						</CategorySection>
					</Show>
					<Show when={result().songs && result().songs.length > 0}>
						<CategorySection title="Songs" viewAllHref={`/search?keyword=${encodeURIComponent(keyword())}&type=song`}>
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
											keyword={keyword()}
										>
                                                <InlineLinks class="!text-slate-600" items={song.releases?.map(release => ({ text: release.title, link: `/release/${release.id}` })) ?? []} />
											</SongCard>
										)
									}}
								</For>
							</div>
						</CategorySection>
					</Show>
					<Show when={result().releases && result().releases.length > 0}>
						<CategorySection title="Releases" viewAllHref={`/search?keyword=${encodeURIComponent(keyword())}&type=release`}>
							<div class="flex gap-2 overflow-x-auto mb-4">
								<For each={result().releases}>
									{(release) => (
									<ReleaseCard
												href={`/release/${release.id}`}
												release={release}
										keyword={keyword()}
									/>
									)}
								</For>
							</div>
						</CategorySection>
					</Show>
					<Show when={true}>
						<CategorySection title="Playlists" viewAllHref={`/search?keyword=${encodeURIComponent(keyword())}&type=playlist`}>
							<div class="grid grid-cols-2 gap-1 mb-6">
								<For each={mockPlaylists}>
									{(playlist) => (
										<PlaylistCard
											href={`/playlist/${playlist.id}`}
											playlist={playlist}
											keyword={keyword()}
										/>
									)}
								</For>
							</div>
						</CategorySection>
					</Show>
					<Show when={true}>
						<CategorySection title="Users" viewAllHref={`/search?keyword=${encodeURIComponent(keyword())}&type=user`}>
							<div class="grid grid-cols-2 gap-1 mb-6">
								<For each={mockUsers}>
									{(user) => (
										<UserCard
											href={`/user/${user.id}`}
											user={user}
											keyword={keyword()}
										/>
									)}
								</For>
							</div>
						</CategorySection>
					</Show>
				</div>
			)}
		</Show>
	)
}
