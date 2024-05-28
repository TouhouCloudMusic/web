import { createAsync } from "@solidjs/router"
import { Show, Suspense, createResource } from "solid-js"
import {
	findArtistWithAlias,
	findArtistMember,
	findArtistMemberOf,
	addData,
} from "~/server/db/artist/artist_model"
import {
	resetArtistTableAutoIncrement,
	resetAutoIncrement,
} from "~/server/db/util/reset_auto_increment"

export default function () {
	const [data] = createResource(() => findArtistWithAlias())
	const group = createAsync(() => findArtistMember())
	const findMemberTest = createAsync(() => findArtistMemberOf())
	return (
		<>
			<button
				class="button p-2"
				onClick={() => addData()}>
				Add
			</button>
			<button
				class="button p-2"
				onClick={() => resetArtistTableAutoIncrement()}>
				Reset Auto Increment
			</button>
			<button
				class="button p-2"
				onClick={() => resetAutoIncrement("artist")}>
				Reset Auto Increment B
			</button>
			<button
				class="button p-2"
				onClick={() => console.log(data())}>
				Log First Aritst
			</button>
			<button
				class="button p-2"
				onClick={() => console.log(group())}>
				Log Group Member
			</button>
			<button
				class="button p-2"
				onClick={() => console.log(findMemberTest())}>
				Log Member of Artist
			</button>
		</>
	)
}
