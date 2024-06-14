import {
	createFormStore,
	getValues,
	insert,
	remove,
	setValues,
	valiForm,
} from "@modular-forms/solid"
import { either } from "fp-ts"
import { pipe } from "fp-ts/lib/function"
import { createSignal } from "solid-js"
import { ArtistType } from "~/database/artist/artist_model"
import { ArtistDataByID } from "~/database/artist/find_artist_by_id"
import {
	ArtistDataByKeyword,
	findArtistByKeyword,
} from "~/database/artist/find_artist_by_keyword"
import { ArtistFormSchema } from "./form_schema"
import { ArtistForm, MemberList, MemberListItem } from "./type"

export function createController() {
	const [artistData, setArtistData] = createSignal<ArtistDataByID>()
	const formStore = createFormStore<ArtistForm>({
		validate: valiForm(ArtistFormSchema),
	})
	// type
	const [artistType, setArtistType] = createSignal<ArtistType>()

	function setArtistTypeWithSwapMemberListCache(type: ArtistType) {
		setArtistType(type)
		setMemberSearchResult(undefined)
		const cache = memberListCache()
		const memberList = getValues(formStore, "member") as MemberList
		setMemberListCache(memberList)
		setValues(formStore, "member", cache ?? [])
	}

	const typeController = {
		get value() {
			return artistType()
		},
		setType: setArtistTypeWithSwapMemberListCache,
		toPerson: () => setArtistTypeWithSwapMemberListCache("Person"),
		toGroup: () => setArtistTypeWithSwapMemberListCache("Group"),
	}
	// member
	const [memberSearchResult, setMemberSearchResult] =
		createSignal<ArtistDataByKeyword>()
	const [memberListCache, setMemberListCache] = createSignal<MemberList>()

	const memberController = {
		searchResult: memberSearchResult,

		add: (input: { id: bigint; name: string; type: ArtistType }) => {
			const artist: MemberListItem = {
				artist_id: input.id.toString(),
				name: input.name,
				type: input.type,
				isString: false,
				group_member_id: "",
			}
			const memberList = getValues(formStore, "member")
			if (artist.artist_id === memberList.find((a) => a?.artist_id)) return
			if (artist.type === artistType()) return
			insert(formStore, "member", {
				value: artist,
			})
		},

		addStringInput: () => {
			insert(formStore, "member", {
				value: {
					artist_id: "",
					type: artistType() === "Person" ? "Group" : "Person",
					name: "",
					isString: true,
					group_member_id: "",
				},
			})
		},

		remove: (index: number) => {
			remove(formStore, "member", {
				at: index,
			})
		},

		serach: async (keyword: string) => {
			if (keyword.length < 3) {
				return setMemberSearchResult(undefined)
			} else
				return pipe(
					await findArtistByKeyword(
						keyword,
						artistType() === "Person" ? "Group" : "Person"
					),
					either.match(
						(err) => {
							throw err
						},
						(data) => {
							setMemberSearchResult(data)
						}
					)
				)
		},
	}
	return {
		artistData,
		setArtistData,
		formStore,
		type: typeController,
		member: memberController,
	}
}
