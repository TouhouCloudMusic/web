import { createFileRoute } from "@tanstack/solid-router"

import type { Release } from "~/api/release"
import { ReleaseInfoPage } from "~/views/song/release"

export const Route = createFileRoute("/release/mock")({
	component: RouteComponent,
})

// const TRACK_IDS = {
// 	TRACK_1: "WAP-WA",
// 	TRACK_2: "秋扇",
// 	TRACK_3: "荊の城",
// 	TRACK_4: "MyonMyonMyonMyonMyon!",
// 	TRACK_5: "花のいろは",
// 	TRACK_6: "月齢11.3のキャンドルマジック",
// 	TRACK_7: "ホシノナミダ",
// 	TRACK_8: "うさぎ大爆発",
// } as const
// Track IDs for the release
const TRACK_IDS = {
	TRACK_1: 201,
	TRACK_2: 202,
	TRACK_3: 203,
	TRACK_4: 204,
	TRACK_5: 205,
	TRACK_6: 206,
	TRACK_7: 207,
	TRACK_8: 208,
} as const
/**
 * 
Mock Data:
2010/12/30 コミックマーケットC79（2日目）東P-36a ShibayanRecords にて頒布

及び 31日（3日目）東ラ-08b SpriteWing にて委託頒布

・全曲エレクトロ！な東方Projectアレンジアルバム

・プレスCD 全8曲（Vocal 6曲／インスト 2曲）

・スリーブケース入りプレスCD

・イベント頒布価格1000円／ショップ委託価格1470円（税込）

Vocal : 3L / 深水チエ / yana / 坂上なち / ℃iel

Lyric : 深水チエ / やまざきさやか / MAYA / Shibayan

Arrangement : Shibayan

Illustration : いちはや
 */
const mockReleaseData: Release = {
	id: 101,
	title: "ココロバイブレーション",
	release_type: "Album",
	release_date: "2010-12-30",
	release_date_precision: "Day",
	recording_date_start: "2010-01-01",
	recording_date_start_precision: "Month",
	recording_date_end: "2010-12-30",
	recording_date_end_precision: "Month",
	artists: [
		{
			id: 1,
			name: "3L",
		},
		{
			id: 2,
			name: "深水チエ",
		},
		{
			id: 3,
			name: "yana",
		},
		{
			id: 4,
			name: "坂上なち",
		},
		{
			id: 5,
			name: "℃iel",
		},
		{
			id: 6,
			name: "やまざきさやか",
		},
		{
			id: 7,
			name: "MAYA",
		},
		{
			id: 8,
			name: "Shibayan",
		},
	],
	credits: [
		{
			artist: {
				id: 1,
				name: "3L",
			},
			role: {
				id: 1,
				name: "Vocalist",
			},
			on: [TRACK_IDS.TRACK_4, TRACK_IDS.TRACK_6],
		},
		{
			artist: {
				id: 2,
				name: "深水チエ",
			},
			role: {
				id: 2,
				name: "Vocalist",
			},
			on: [TRACK_IDS.TRACK_3],
		},
		{
			artist: {
				id: 3,
				name: "yana",
			},
			role: {
				id: 3,
				name: "Vocalist",
			},
			on: [TRACK_IDS.TRACK_5],
		},
		{
			artist: {
				id: 4,
				name: "坂上なち",
			},
			role: {
				id: 4,
				name: "Vocalist",
			},
			on: [TRACK_IDS.TRACK_8],
		},
		{
			artist: {
				id: 5,
				name: "℃iel",
			},
			role: {
				id: 5,
				name: "Vocalist",
			},
			on: [TRACK_IDS.TRACK_2],
		},
		{
			artist: {
				id: 6,
				name: "やまざきさやか",
			},
			role: {
				id: 6,
				name: "Lyricist",
			},
			on: [TRACK_IDS.TRACK_6],
		},
		{
			artist: {
				id: 7,
				name: "MAYA",
			},
			role: {
				id: 7,
				name: "Lyricist",
			},
			on: [TRACK_IDS.TRACK_2],
		},
		{
			artist: {
				id: 8,
				name: "Shibayan",
			},
			role: {
				id: 8,
				name: "Arranger & Lyricist",
			},
			on: [TRACK_IDS.TRACK_1, TRACK_IDS.TRACK_2, TRACK_IDS.TRACK_3, TRACK_IDS.TRACK_4, TRACK_IDS.TRACK_5, TRACK_IDS.TRACK_6, TRACK_IDS.TRACK_7, TRACK_IDS.TRACK_8],
		},
	],
	catalog_nums: [
		{
			catalog_number: "LR2025-001",
			label_id: 10,
		},
		{
			catalog_number: "NOVA-ALB-2025-04",
			label_id: 11,
		},
	],
	localized_titles: [
		{
			language: {
				id: 1,
				code: "en",
				name: "English",
			},
			title: "Kokoro Vibration",
		},
		{
			language: {
				id: 2,
				code: "ja",
				name: "Japanese",
			},
			title: "ココロバイブレーション",
		}
	],
	tracks: [TRACK_IDS.TRACK_1, TRACK_IDS.TRACK_2, TRACK_IDS.TRACK_3, TRACK_IDS.TRACK_4, TRACK_IDS.TRACK_5, TRACK_IDS.TRACK_6, TRACK_IDS.TRACK_7, TRACK_IDS.TRACK_8],
}

function RouteComponent() {
	return <ReleaseInfoPage release={mockReleaseData} keyword="mock" />
}
