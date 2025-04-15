import { Show, Switch, Match, For } from "solid-js"
import { PageLayout } from "~/components/layout/PageLayout"
import { songInfoQuery } from "~/data/song_info"
import { Loader2, Languages, Music, Globe2, List } from "lucide-solid"

export function SongInfo(id: number) {
    const queryResult = songInfoQuery(id)

    return (
        <PageLayout>
            <div class="w-full max-w-4xl mx-auto mt-8 px-4"></div>
	<div class="w-full max-w-3xl mx-auto mt-8 px-4 col-span-12 col-start-7 flex flex-col items-center gap-4">
		<h1 class="text-3xl font-bold text-center mb-6">🎵 Song Info</h1>

		<Switch>
			<Match when={queryResult.isLoading}>
				<p class="text-center text-lg text-gray-600">少女祈祷中...</p>
			</Match>

			<Match when={queryResult.isSuccess}>
				<Show when={queryResult.data?.data}>
					<div class="bg-white rounded-2xl shadow p-6 space-y-6">
						{/* 基本信息 */}
						<div>
							<h2 class="text-2xl font-semibold mb-2">基本信息</h2>
							<p><strong>songID:</strong> {queryResult.data.data.id}</p>
							<p><strong>Title:</strong> {queryResult.data.data.title}</p>
						</div>

						{/* Credits */}
						<div>
							<h2 class="text-xl font-semibold mb-2">Credits</h2>
							<ul class="list-disc list-inside space-y-1">
								{queryResult.data.data.credits.length === 0 ? (
									<li class="text-gray-500">No credits available</li>
								) : (
									queryResult.data.data.credits.map((credit, index) => (
										<li key={index}>{credit}</li>
									))
								)}
							</ul>
						</div>

						{/* Languages */}
						<div>
							<h2 class="text-xl font-semibold mb-2">Languages</h2>
							<ul class="list-disc list-inside space-y-1">
								{queryResult.data.data.languages.map((lang) => (
									<li key={lang.id}>
										{lang.name} ({lang.code})
									</li>
								))}
							</ul>
						</div>

						{/* Localized Titles */}
						<div>
							<h2 class="text-xl font-semibold mb-2">Localized Titles</h2>
							<ul class="list-disc list-inside space-y-1">
								{queryResult.data.data.localized_titles.map((lt, index) => (
									<li key={index}>
										Language ID: {lt.language_id}, Title: {lt.title}
									</li>
								))}
							</ul>
						</div>
					</div>
				</Show>
			</Match>

			<Match when={queryResult.isError}>
				<p class="text-center text-red-600 font-semibold">Error loading Song Infomation</p>
			</Match>
		</Switch>
	</div>
</PageLayout>

	)
}
