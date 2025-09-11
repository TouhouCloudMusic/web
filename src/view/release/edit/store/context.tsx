import { insert, remove, setInput } from "@formisch/solid"
import type { Artist, Event, Song, CreditRoleRef } from "@thc/api"
import { createContext, useContext } from "solid-js"
import type { ParentProps } from "solid-js"
import { createStore } from "solid-js/store"

import type { ReleaseFormStore } from "../comp/types"

export type CreditRow = { artist?: Artist; role?: CreditRoleRef; on: number[] }

export type ReleaseEditState = {
	artists: Artist[]
	events: Event[]
	credits: CreditRow[]
	trackSongs: (Song | undefined)[]
	trackArtists: Artist[][]
}

export type ReleaseEditStore = {
	form: ReleaseFormStore
	artists: Artist[]
	events: Event[]
	credits: CreditRow[]
	trackSongs: (Song | undefined)[]
	trackArtists: Artist[][]
	addArtist: (a: Artist) => void
	removeArtistAt: (idx: number) => void
	addEvent: (e: Event) => void
	removeEventAt: (idx: number) => void
	addCreditRow: () => void
	removeCreditRowAt: (idx: number) => void
	setCreditArtist: (idx: number, a: Artist) => void
	setCreditRole: (idx: number, r: CreditRoleRef) => void
	toggleCreditOnTrack: (
		rowIdx: number,
		trackIdx: number,
		checked: boolean,
	) => void
	addTrack: (discIndex: number) => void
	removeTrackAt: (idx: number) => void
	setTrackSong: (idx: number, song: Song | undefined) => void
	addTrackArtist: (idx: number, a: Artist) => void
	removeTrackArtistAt: (idx: number, artistIdx: number) => void
}

const Ctx = createContext<ReleaseEditStore>()

export const useReleaseEditStore = () => {
	const ctx = useContext(Ctx)
	if (!ctx) throw new Error("ReleaseEditStore not provided")
	return ctx
}

// oxlint-disable-next-line max-lines-per-function
export function ReleaseEditProvider(
	props: ParentProps<{ form: ReleaseFormStore }>,
) {
	const [state, setState] = createStore<ReleaseEditState>({
		artists: [],
		events: [],
		credits: [],
		trackSongs: [],
		trackArtists: [],
	})

	const store: ReleaseEditStore = {
		form: props.form,
		get artists() {
			return state.artists
		},
		get events() {
			return state.events
		},
		get credits() {
			return state.credits
		},
		get trackSongs() {
			return state.trackSongs
		},
		get trackArtists() {
			return state.trackArtists
		},
		addArtist: (a) => {
			if (state.artists.some((x) => x.id === a.id)) return
			setState("artists", (prev) => [...prev, a])
			setInput(props.form, {
				path: ["data", "artists"],
				input: [...state.artists, a].map((x) => x.id),
			})
		},
		removeArtistAt: (idx) => {
			const next = state.artists.slice()
			next.splice(idx, 1)
			setState("artists", next)
			setInput(props.form, {
				path: ["data", "artists"],
				input: next.map((x) => x.id),
			})
		},
		addEvent: (e) => {
			if (state.events.some((x) => x.id === e.id)) return
			setState("events", (prev) => [...prev, e])
			setInput(props.form, {
				path: ["data", "events"],
				input: [...state.events, e].map((x) => x.id),
			})
		},
		removeEventAt: (idx) => {
			const next = state.events.slice()
			next.splice(idx, 1)
			setState("events", next)
			setInput(props.form, {
				path: ["data", "events"],
				input: next.map((x) => x.id),
			})
		},
		addCreditRow: () => setState("credits", (prev) => [...prev, { on: [] }]),
		removeCreditRowAt: (idx) => {
			const next = state.credits.slice()
			next.splice(idx, 1)
			setState("credits", next)
		},
		setCreditArtist: (idx, a) => {
			setState("credits", idx, (row) => ({
				...(row ?? { on: [] as number[] }),
				artist: a,
			}))
		},
		setCreditRole: (idx, r) => {
			setState("credits", idx, (row) => ({
				...(row ?? { on: [] as number[] }),
				role: r,
			}))
		},
		toggleCreditOnTrack: (rowIdx, trackIdx, checked) => {
			const curr = state.credits[rowIdx]?.on ?? []
			const on = checked
				? [...curr, trackIdx]
				: curr.filter((x) => x !== trackIdx)
			setState("credits", rowIdx, (row) => ({
				...(row ?? { on: [] as number[] }),
				on,
			}))
		},
		addTrack: (discIndex) => {
			insert(props.form, {
				path: ["data", "tracks"],
				initialInput: { disc_index: discIndex },
			})
			setState("trackSongs", (prev) => [...prev, undefined])
			setState("trackArtists", (prev) => [...prev, []])
		},
		removeTrackAt: (idx) => {
			remove(props.form, { path: ["data", "tracks"], at: idx })
			const songs = state.trackSongs.slice()
			songs.splice(idx, 1)
			setState("trackSongs", songs)
			const arts = state.trackArtists.slice()
			arts.splice(idx, 1)
			setState("trackArtists", arts)
		},
		setTrackSong: (idx, song) => {
			setState("trackSongs", idx, song)
			setInput(props.form, {
				path: ["data", "tracks", idx, "song_id"],
				input: (song
					? song.id
					: (undefined as unknown as never)) as unknown as never,
			})
		},
		addTrackArtist: (idx, a) => {
			if (state.trackArtists[idx]?.some((x) => x.id === a.id)) return
			const next = (state.trackArtists[idx] ?? []).concat([a])
			setState("trackArtists", idx, next)
			setInput(props.form, {
				path: ["data", "tracks", idx, "artists"],
				input: next.map((x) => x.id) as unknown as never,
			})
		},
		removeTrackArtistAt: (idx, artistIdx) => {
			const next = (state.trackArtists[idx] ?? []).slice()
			next.splice(artistIdx, 1)
			setState("trackArtists", idx, next)
			setInput(props.form, {
				path: ["data", "tracks", idx, "artists"],
				input: next.map((x) => x.id) as unknown as never,
			})
		},
	}

	return <Ctx.Provider value={store}>{props.children}</Ctx.Provider>
}
