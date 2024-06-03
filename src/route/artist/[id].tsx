import {
	Params,
	cache,
	createAsync,
	redirect,
	useParams,
} from "@solidjs/router"
import dayjs from "dayjs"
import { Show, Suspense, createEffect, on, onMount } from "solid-js"
import { findArtistByID } from "~/database/artist/find_artist_by_id"

const getArtistData = cache(async function (params: Params) {
	const ERR = Symbol("err")
	try {
		const id = parseInt(params?.["id"], 10)
		if (isNaN(id)) throw ERR
		const res = await findArtistByID(id)
		if (!res) throw ERR
		return res
	} catch (e) {
		if (e === ERR) throw redirect("/404")
		else console.log(e)
	}
}, `artist_by_id`)

type ArtistData = Awaited<ReturnType<typeof getArtistData>>
// type Controller = ReturnType<typeof controller>
// function controller(state: ArtistData, setState: SetStoreFunction<ArtistData>) {
// 	return {
// 		data: () => state,
// 		setData: (data: ArtistData) => setState(data),
// 	}
// }

export default function ArtistPage() {
	const data = createAsync(() => getArtistData(useParams()))
	onMount(() => {
		console.log(data())
		console.log("123")
	})

	return (
		<Suspense fallback={<div>Loading...</div>}>
			<Show when={data()}>
				<Main data={() => data()!} />
			</Show>
		</Suspense>
	)
}

function Main(props: { data: () => ArtistData }) {
	return (
		<main>
			<h2>{props.data()?.name}</h2>
			<div class="flex">
				<Show
					when={
						props.data()?.type === "Person" &&
						props.data()?.member_of
					}>
					<p>member of </p>
					<ul>
						{props.data()?.member_of.map((m) => (
							<li>
								<a
									href={`/artist/${m.id}`}
									class="link">
									{m.name}
								</a>
							</li>
						))}
					</ul>
				</Show>
				<Show
					when={
						props.data()?.type === "Group" && props.data()?.members
					}>
					<p>members </p>
					<ul>
						{props.data()?.members.map((m) => (
							<li>
								<a
									href={`/artist/${m.id}`}
									class="link">
									{m.name}
								</a>
							</li>
						))}
					</ul>
				</Show>
			</div>
			<div class="flex">
				<p>Release </p>
				<ul>
					{props.data()?.release.map((r) => (
						<li>
							<a
								href={`/release/${r.release_id}`}
								class="link">
								{r.release.title}
							</a>
							{
								// prettier-ignore
								r.release.release_date
						  ? <> - {dayjs(r.release.release_date).format("YYYY")}</>
						  : ""
							}
						</li>
					))}
				</ul>
			</div>
			<Show when={props.data()?.release_credit.length}>
				<div class="flex">
					<p>Credits </p>
					<ul>
						{props.data()?.release_credit.map((r) => (
							<li class="flex">
								<a
									href={`/release/${r.release.id}`}
									class="link">
									{r.release.title}
								</a>
								{r.release ?
									<ul class="flex">
										-
										{r.credit_role.map((c) => (
											<li class="italic">{c.name}</li>
										))}
									</ul>
								:	""}
							</li>
						))}
					</ul>
				</div>
			</Show>
		</main>
	)
}
