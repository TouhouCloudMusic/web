import { Loader2, Music, Languages, Globe2, Users } from "lucide-solid"
import { Show, Switch, Match } from "solid-js"

import { songInfoQuery } from "~/api/song/song_info"

export function SongInfo(id: number) {
	const queryResult = songInfoQuery(id)

	return (
		<div class="mx-auto mt-10 flex w-full max-w-4xl flex-col items-center gap-6 px-6">
			<h1 class="text-center text-4xl font-bold text-blue-800">
				🎵 Song Information
			</h1>

			<Switch>
				<Match when={queryResult.isLoading}>
					<div class="mt-10 flex flex-col items-center justify-center text-blue-600">
						<Loader2
							class="mb-2 animate-spin"
							size={32}
						/>
						<p class="text-lg font-medium">少女祈祷中... Loading song data</p>
					</div>
				</Match>

				<Match when={queryResult.isSuccess}>
					<Show when={queryResult.data?.data}>
						<div class="w-full space-y-8 rounded-3xl bg-white p-8 shadow-xl">
							{/* 基本信息 */}
							<section class="rounded-xl bg-blue-100 p-6 shadow-inner">
								<div class="mb-4 flex items-center gap-2 text-blue-900">
									<Music size={20} />
									<h2 class="text-2xl font-semibold">基本信息</h2>
								</div>
								<p>
									<strong>🎵 ID:</strong> {queryResult.data.data.id}
								</p>
								<p>
									<strong>🎶 Title:</strong> {queryResult.data.data.title}
								</p>
							</section>

							{/* Credits */}
							<section class="rounded-xl bg-yellow-100 p-6 shadow-inner">
								<div class="mb-4 flex items-center gap-2 text-yellow-900">
									<Users size={20} />
									<h2 class="text-xl font-semibold">Credits</h2>
								</div>
								<ul class="list-inside list-disc space-y-1 text-gray-800">
									{queryResult.data.data.credits.length === 0 ?
										<li class="text-gray-500">No credits available</li>
									:	queryResult.data.data.credits.map((credit, index) => (
											<li key={index}>{credit}</li>
										))
									}
								</ul>
							</section>

							{/* Languages */}
							<section class="rounded-xl bg-green-100 p-6 shadow-inner">
								<div class="mb-4 flex items-center gap-2 text-green-900">
									<Languages size={20} />
									<h2 class="text-xl font-semibold">Languages</h2>
								</div>
								<ul class="grid grid-cols-2 gap-2 text-gray-800">
									{queryResult.data.data.languages.map((lang) => (
										<li
											key={lang.id}
											class="flex items-center gap-1"
										>
											🌍 {lang.name} ({lang.code})
										</li>
									))}
								</ul>
							</section>

							{/* Localized Titles */}
							<section class="rounded-xl bg-purple-100 p-6 shadow-inner">
								<div class="mb-4 flex items-center gap-2 text-purple-900">
									<Globe2 size={20} />
									<h2 class="text-xl font-semibold">Localized Titles</h2>
								</div>
								<ul class="space-y-1 text-gray-800">
									{queryResult.data.data.localized_titles.map((lt, index) => (
										<li key={index}>
											🌐 Language ID: <strong>{lt.language_id}</strong>, Title:{" "}
											<em>{lt.title}</em>
										</li>
									))}
								</ul>
							</section>
						</div>
					</Show>
				</Match>

				<Match when={queryResult.isError}>
					<p class="mt-8 text-center font-semibold text-red-600">
						⚠️ Error loading Song Information
					</p>
				</Match>
			</Switch>
		</div>
	)
}
