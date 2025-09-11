import { insert, remove, setInput } from "@formisch/solid"
import type { Artist, Event, Song, CreditRoleRef } from "@thc/api"
import { batch, createContext } from "solid-js"
import type { ParentProps } from "solid-js"
import { createStore } from "solid-js/store"
import type { SetStoreFunction } from "solid-js/store"

import { assertContext } from "~/utils/solid"

import type { ReleaseFormStore } from "../comp/types"

export type CreditRow = { artist?: Artist; role?: CreditRoleRef; on: number[] }

type ReleaseFormContextValue = {
	artists: Artist[]
	events: Event[]
	credits: CreditRow[]
	trackSongs: (Song | undefined)[]
	trackArtists: Artist[][]
}

const createReleaseFormContext = (
	form: ReleaseFormStore,
	state: ReleaseFormContextValue,
	setState: SetStoreFunction<ReleaseFormContextValue>,
) => {
	const store = {
		form,
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
		addArtist: (a: Artist) => {
			if (state.artists.some((x) => x.id === a.id)) return
			insert(form, { path: ["data", "artists"], initialInput: a.id })
			setState("artists", state.artists.length, a)
		},
		removeArtistAt: (idx: number) => () => {
			remove(form, { path: ["data", "artists"], at: idx })
			setState("artists", (users) => users.toSpliced(idx, 1))
		},
		addEvent: (e: Event) => {
			if (state.events.some((x) => x.id === e.id)) return
			insert(form, { path: ["data", "events"], initialInput: e.id })
			setState("events", state.events.length, e)
		},
		removeEventAt: (idx: number) => () => {
			remove(form, { path: ["data", "events"], at: idx })
			setState("events", (list) => list.toSpliced(idx, 1))
		},
		addCreditRow: () => {
			insert(form, { path: ["data", "credits"], initialInput: {} })
			setState("credits", state.credits.length, { on: [] })
		},
		removeCreditRowAt: (idx: number) => () => {
			remove(form, { path: ["data", "credits"], at: idx })
			setState("credits", (list) => list.toSpliced(idx, 1))
		},
		setCreditArtist: (idx: number) => (a: Artist) => {
			setState("credits", idx, (row) => ({
				...(row ?? { on: [] }),
				artist: a,
			}))
			setInput(form, {
				path: ["data", "credits", idx, "artist_id"],
				input: a.id,
			})
		},
		setCreditRole: (idx: number) => (r: CreditRoleRef) => {
			setState("credits", idx, (row) => ({
				...(row ?? { on: [] }),
				role: r,
			}))
			setInput(form, {
				path: ["data", "credits", idx, "role_id"],
				input: r.id,
			})
		},
		toggleCreditOnTrack:
			(rowIdx: number, trackIdx: number) => (checked: boolean) => {
				const curr = state.credits[rowIdx]?.on ?? []
				const on = checked
					? [...curr, trackIdx]
					: curr.filter((x) => x !== trackIdx)
				setState("credits", rowIdx, (row) => ({
					...(row ?? { on: [] }),
					on,
				}))
				setInput(form, {
					path: ["data", "credits", rowIdx, "on"],
					input: on,
				})
			},
		addTrack: (discIndex: number) => {
			batch(() => {
				insert(form, {
					path: ["data", "tracks"],
					initialInput: { disc_index: discIndex },
				})
				setState("trackSongs", state.trackSongs.length, undefined)
				setState("trackArtists", state.trackArtists.length, [])
			})
		},
		removeTrackAt: (idx: number) => () => {
			batch(() => {
				remove(form, { path: ["data", "tracks"], at: idx })
				setState("trackSongs", (list) => list.toSpliced(idx, 1))
				setState("trackArtists", (list) => list.toSpliced(idx, 1))
			})
		},
		setTrackSong: (trackIdx: number) => (song: Song) => {
			setState("trackSongs", trackIdx, song)
			setInput(form, {
				path: ["data", "tracks", trackIdx, "song_id"],
				input: song.id,
			})
		},
		addTrackArtist: (trackIdx: number, a: Artist) => {
			if (state.trackArtists[trackIdx]?.some((x) => x.id === a.id)) return
			const len = state.trackArtists[trackIdx]?.length ?? 0
			setState("trackArtists", trackIdx, len, a)
			const nextIds = [
				...(state.trackArtists[trackIdx]?.map((x) => x.id) ?? []),
				a.id,
			]
			setInput(form, {
				path: ["data", "tracks", trackIdx, "artists"],
				input: nextIds,
			})
		},
		removeTrackArtistAt: (idx: number, artistIdx: number) => () => {
			const next = (state.trackArtists[idx] ?? []).toSpliced(artistIdx, 1)
			setState("trackArtists", idx, next)
			setInput(form, {
				path: ["data", "tracks", idx, "artists"],
				input: next.map((a) => a.id),
			})
		},
	}

	return store
}

const Ctx = createContext<ReturnType<typeof createReleaseFormContext>>()

export const useReleaseFormContext = (): ReturnType<
	typeof createReleaseFormContext
> => {
	return assertContext(Ctx, "Release Form Context")
}

// oxlint-disable-next-line max-lines-per-function
export function ReleaseFormContextProvider(
	props: ParentProps<{ form: ReleaseFormStore }>,
) {
	const [state, setState] = createStore<ReleaseFormContextValue>({
		artists: [],
		events: [],
		credits: [],
		trackSongs: [],
		trackArtists: [],
	})

	const store = createReleaseFormContext(props.form, state, setState)

	return <Ctx.Provider value={store}>{props.children}</Ctx.Provider>
}
