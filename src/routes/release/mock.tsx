import { createFileRoute } from "@tanstack/solid-router"
import type { Release } from "@thc/api"

import { ReleaseInfoPage } from "~/views/release/Info"

export const Route = createFileRoute("/release/mock")({
	component: RouteComponent,
})

const mockData: Release = {
	id: 1,
	title: "東方紅魔郷 ～ the Embodiment of Scarlet Devil",
	release_type: "Album",
	cover_art_url: "https://picsum.photos/400/400?random=1",
	release_date: "2002-08-11",
	release_date_precision: "Day",
	recording_date_start: "2002-06-01",
	recording_date_start_precision: "Month",
	recording_date_end: "2002-07-31",
	recording_date_end_precision: "Month",
	artists: [
		{
			id: 1,
			name: "ZUN",
		},
		{
			id: 2,
			name: "Team Shanghai Alice",
		},
	],
	localized_titles: [
		{
			language: {
				id: 1,
				code: "ja",
				name: "Japanese",
			},
			title: "東方紅魔郷 ～ the Embodiment of Scarlet Devil",
		},
		{
			language: {
				id: 2,
				code: "en",
				name: "English",
			},
			title: "Touhou Koumakyou ~ the Embodiment of Scarlet Devil",
		},
		{
			language: {
				id: 3,
				code: "zh-Hans",
				name: "Simplified Chinese",
			},
			title: "东方红魔乡 ～ the Embodiment of Scarlet Devil",
		},
	],
	catalog_nums: [
		{
			catalog_number: "TH06",
			label_id: 1,
		},
		{
			catalog_number: "TEAM-SHA-001",
			label_id: null,
		},
	],
	tracks: [
		{
			id: 1,
			track_number: "1",
			song: { id: 1, title: "赤より紅い夢" },
			artists: [],
			duration: 62000,
		},
		{
			id: 2,
			track_number: "2",
			song: { id: 2, title: "ほおずきみたいに紅い魂" },
			artists: [],
			duration: 234000,
		},
		{
			id: 3,
			track_number: "3",
			song: { id: 3, title: "妖魔夜行" },
			artists: [],
			duration: 184000,
		},
	],
	credits: [
		{
			artist: {
				id: 1,
				name: "ZUN",
			},
			role: {
				id: 1,
				name: "Original Composer",
			},
			on: null,
		},
		{
			artist: {
				id: 1,
				name: "ZUN",
			},
			role: {
				id: 2,
				name: "Game Designer",
			},
			on: null,
		},
		{
			artist: {
				id: 1,
				name: "ZUN",
			},
			role: {
				id: 3,
				name: "Programmer",
			},
			on: null,
		},
		{
			artist: {
				id: 1,
				name: "ZUN",
			},
			role: {
				id: 4,
				name: "Artist",
			},
			on: [1, 2, 3, 4, 5],
		},
		{
			artist: {
				id: 2,
				name: "Team Shanghai Alice",
			},
			role: {
				id: 5,
				name: "Publisher",
			},
			on: null,
		},
		{
			artist: {
				id: 3,
				name: "Mastering Engineer",
			},
			role: {
				id: 6,
				name: "Audio Engineer",
			},
			on: [6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20],
		},
	],
}

function RouteComponent() {
	return (
		<>
			<ReleaseInfoPage release={mockData} />
		</>
	)
}