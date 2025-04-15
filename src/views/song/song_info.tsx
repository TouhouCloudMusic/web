import { Link, useParams } from "@tanstack/solid-router"
import { Match, Show, Switch } from "solid-js"
import { Button } from "~/components/button"
import { PageLayout } from "~/components/layout/PageLayout"
import { songInfoQuery, PostTest } from "~/data/song_info"

export function SongInfo(id: number) {
	const queryResult = songInfoQuery(id)

	return (
		<PageLayout>
			<div class="col-span-12 col-start-7 flex flex-col items-center gap-4">
				<Switch>
					<Match when={queryResult.isLoading}>
						<div class="text-center text-xl font-bold">少女祈祷中...</div>
					</Match>

					<Match when={queryResult.isSuccess}>
						<Show when={queryResult.data?.data}>
							<div class="flex flex-col items-center gap-4">
								<div class="text-xl font-bold">
									songID = {queryResult.data?.data.id}
								</div>
								<h2 class="text-xl font-bold">
									Title = {queryResult.data?.data.title}
								</h2>

								{/* Credits */}
								<div class="text-lg font-semibold">Credits:</div>
								<ul>
									{queryResult.data?.data.credits.length === 0 ?
										<li class="text-gray-500">No credits available</li>
									:	queryResult.data?.data.credits.map((credit, index) => (
											<li key={index}>{credit}</li>
										))
									}
								</ul>

								{/* Languages */}
								<div class="text-lg font-semibold">Languages:</div>
								<ul>
									{queryResult.data?.data.languages.map((lang) => (
										<li key={lang.id}>
											{lang.name} ({lang.code})
										</li>
									))}
								</ul>

								{/* Localized Titles */}
								<div class="text-lg font-semibold">Localized Titles:</div>
								<ul>
									{queryResult.data?.data.localized_titles.map((lt, index) => (
										<li key={index}>
											Language ID: {lt.language_id}, Title: {lt.title}
										</li>
									))}
								</ul>
							</div>
						</Show>
					</Match>

					<Match when={queryResult.isError}>
						<div>Error loading Song profile</div>
					</Match>
				</Switch>
			</div>
		</PageLayout>
	)
}
