import { Show, Switch, Match } from "solid-js"
import { songInfoQuery } from "~/data/song_info"
import { Loader2, Music, Languages, Globe2, Users } from "lucide-solid"

export function SongInfo(id: number) {
	const queryResult = songInfoQuery(id)

	return (
		<div class="w-full max-w-4xl mx-auto mt-10 px-6 flex flex-col items-center gap-6">
			<h1 class="text-4xl font-bold text-center text-blue-800">🎵 Song Information</h1>

			<Switch>
				<Match when={queryResult.isLoading}>
					<div class="flex flex-col items-center justify-center text-blue-600 mt-10">
						<Loader2 class="animate-spin mb-2" size={32} />
						<p class="text-lg font-medium">少女祈祷中... Loading song data</p>
					</div>
				</Match>

				<Match when={queryResult.isSuccess}>
					<Show when={queryResult.data?.data}>
						<div class="bg-white rounded-3xl shadow-xl p-8 space-y-8 w-full">

							{/* 基本信息 */}
							<section class="bg-blue-100 rounded-xl p-6 shadow-inner">
								<div class="flex items-center gap-2 mb-4 text-blue-900">
									<Music size={20} />
									<h2 class="text-2xl font-semibold">基本信息</h2>
								</div>
								<p><strong>🎵 ID:</strong> {queryResult.data.data.id}</p>
								<p><strong>🎶 Title:</strong> {queryResult.data.data.title}</p>
							</section>

							{/* Credits */}
							<section class="bg-yellow-100 rounded-xl p-6 shadow-inner">
								<div class="flex items-center gap-2 mb-4 text-yellow-900">
									<Users size={20} />
									<h2 class="text-xl font-semibold">Credits</h2>
								</div>
								<ul class="list-disc list-inside space-y-1 text-gray-800">
									{queryResult.data.data.credits.length === 0 ? (
										<li class="text-gray-500">No credits available</li>
									) : (
										queryResult.data.data.credits.map((credit, index) => (
											<li key={index}>{credit}</li>
										))
									)}
								</ul>
							</section>

							{/* Languages */}
							<section class="bg-green-100 rounded-xl p-6 shadow-inner">
								<div class="flex items-center gap-2 mb-4 text-green-900">
									<Languages size={20} />
									<h2 class="text-xl font-semibold">Languages</h2>
								</div>
								<ul class="grid grid-cols-2 gap-2 text-gray-800">
									{queryResult.data.data.languages.map((lang) => (
										<li key={lang.id} class="flex items-center gap-1">
											🌍 {lang.name} ({lang.code})
										</li>
									))}
								</ul>
							</section>

							{/* Localized Titles */}
							<section class="bg-purple-100 rounded-xl p-6 shadow-inner">
								<div class="flex items-center gap-2 mb-4 text-purple-900">
									<Globe2 size={20} />
									<h2 class="text-xl font-semibold">Localized Titles</h2>
								</div>
								<ul class="space-y-1 text-gray-800">
									{queryResult.data.data.localized_titles.map((lt, index) => (
										<li key={index}>
											🌐 Language ID: <strong>{lt.language_id}</strong>, Title: <em>{lt.title}</em>
										</li>
									))}
								</ul>
							</section>
						</div>
					</Show>
				</Match>

				<Match when={queryResult.isError}>
					<p class="text-center text-red-600 font-semibold mt-8">
						⚠️ Error loading Song Information
					</p>
				</Match>
			</Switch>
		</div>
	)
}
