import { insert, remove, setInput } from "@formisch/solid"
import type {
	Event,
	Song,
	CreditRoleRef,
	Label,
	Release,
	SimpleArtist,
	SimpleEvent,
	SimpleLabel,
	ReleaseCredit,
} from "@thc/api"
import { batch, createContext } from "solid-js"
import type { ParentProps } from "solid-js"
import { createStore } from "solid-js/store"
import type { SetStoreFunction } from "solid-js/store"

import { assertContext } from "~/utils/solid"

import type { ReleaseFormStore } from "./comp/types"

type ReleaseFormContextValue = {
	artists: SimpleArtist[]

	events: SimpleEvent[]

	credits: ReleaseCredit[]

	trackSongs: (Song | undefined)[]
	trackArtists: SimpleArtist[][]

	catalogLabels: (SimpleLabel | undefined)[]
}

// oxlint-disable-next-line max-lines-per-function
function createReleaseFormContext(
	form: ReleaseFormStore,
	state: ReleaseFormContextValue,
	setState: SetStoreFunction<ReleaseFormContextValue>,
) {
	const store = {
		form,

		get artists() {
			return state.artists
		},
		addArtist: (a: SimpleArtist) => {
			if (state.artists.some((x) => x.id === a.id)) return
			insert(form, { path: ["data", "artists"], initialInput: a.id })
			setState("artists", state.artists.length, a)
		},
		removeArtistAt: (idx: number) => () => {
			remove(form, { path: ["data", "artists"], at: idx })
			setState("artists", (users) => users.toSpliced(idx, 1))
		},

		get events() {
			return state.events
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

		get credits() {
			return state.credits
		},
		addCreditRow: () => {
			insert(form, { path: ["data", "credits"], initialInput: {} })
			setState("credits", state.credits.length, { on: [] })
		},
		removeCreditRowAt: (idx: number) => () => {
			remove(form, { path: ["data", "credits"], at: idx })
			setState("credits", (list) => list.toSpliced(idx, 1))
		},
		setCreditArtist: (idx: number) => (a: SimpleArtist) => {
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

		get trackSongs() {
			return state.trackSongs
		},
		get trackArtists() {
			return state.trackArtists
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
		addTrackArtist: (trackIdx: number, a: SimpleArtist) => {
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

		get catalogLabels() {
			return state.catalogLabels
		},
		addCatalogNumber: () => {
			insert(form, {
				path: ["data", "catalog_nums"],
				initialInput: { catalog_number: "", label_id: undefined },
			})
			setState("catalogLabels", state.catalogLabels.length, undefined)
		},
		removeCatalogNumberAt: (idx: number) => () => {
			remove(form, { path: ["data", "catalog_nums"], at: idx })
			setState("catalogLabels", (list) => list.toSpliced(idx, 1))
		},
		setCatalogLabel: (idx: number) => (label: Label) => {
			setInput(form, {
				path: ["data", "catalog_nums", idx, "label_id"],
				input: label.id,
			})
			setState("catalogLabels", idx, { id: label.id, name: label.name })
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
	props: ParentProps<{ form: ReleaseFormStore; initValue?: Release }>,
) {
	const [state, setState] = createStore<ReleaseFormContextValue>({
		artists: props.initValue?.artists ?? [],

		events: props.initValue?.events ?? [],

		credits: props.initValue?.credits ?? [],

		trackSongs:
			props.initValue?.tracks?.map((t) => ({
				id: t.song.id,
				title: t.song.title,
			})) ?? [],
		trackArtists:
			props.initValue?.tracks?.map((t) =>
				(t.artists ?? []).map((a) => ({ id: a.id, name: a.name })),
			) ?? [],

		catalogLabels:
			props.initValue?.catalog_nums?.map((c) => c.label ?? undefined) ?? [],
	})

	const store = createReleaseFormContext(props.form, state, setState)

	return <Ctx.Provider value={store}>{props.children}</Ctx.Provider>
}
