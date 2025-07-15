import { createFileRoute } from "@tanstack/solid-router"

import type { Song } from "~/api/song"
import { SongInfoPage } from "~/views/song/Info"

export const Route = createFileRoute("/song/mock")({
	component: RouteComponent,
})

function RouteComponent() {
	const mockData: Song = {
		id: 1,
		title: "Test Song",
		artists: [
			{
				id: 1,
				name: "Test Artist",
			},
			{
				id: 2,
				name: "Test Artist 2",
			},
			{
				id: 3,
				name: "Test Artist 3",
			},
		],
		releases: [
			{
				id: 1,
				title: "Test Release",
				cover_art_url: "https://placehold.co/4000",
			},
		],
		credits: [
			{
				artist: {
					id: 1,
					name: "Test Artist",
				},
				role: {
					id: 1,
					name: "Vocal",
				},
			},
		],
		languages: [
			{
				id: 1,
				code: "en",
				name: "English",
			},
		],
		localized_titles: [
			{
				language: {
					id: 2,
					code: "ja",
					name: "Japanese",
				},
				title: "テストソング",
			},
		],
	}
	return (
		<>
			<SongInfoPage song={mockData} />
		</>
	)
}
