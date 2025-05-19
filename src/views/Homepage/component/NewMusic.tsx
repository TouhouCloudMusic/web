import { For } from "solid-js"

import { newMusicTracks } from "~/views/Homepage/mock"

export function NewMusic() {
	return (
		<div>
			<div class="mb-4 flex items-center justify-between">
				<h2 class="text-xl font-bold text-gray-800">u6700u65b0u97f3u4e50</h2>
				<a
					href="#"
					class="text-sm text-rose-600 hover:text-rose-700"
				>
					u67e5u770bu66f4u591a
				</a>
			</div>

			<div class="rounded-lg bg-white p-4 shadow">
				<div class="grid grid-cols-2 gap-4">
					<For each={newMusicTracks}>
						{(track) => (
							<div class="flex items-center rounded-md p-2 hover:bg-gray-50">
								<div class="h-10 w-10 flex-shrink-0 overflow-hidden rounded bg-rose-100">
									<img
										src={track.coverUrl}
										alt="u5c01u9762"
										class="h-full w-full object-cover"
									/>
								</div>
								<div class="ml-3 flex-1 overflow-hidden">
									<h4 class="truncate text-sm font-medium text-gray-800">
										{track.title}
									</h4>
									<p class="truncate text-xs text-gray-500">{track.artist}</p>
								</div>
								<button class="p-2 text-gray-400 hover:text-rose-600">
									<svg
										xmlns="http://www.w3.org/2000/svg"
										class="h-5 w-5"
										fill="none"
										viewBox="0 0 24 24"
										stroke="currentColor"
									>
										<path
											stroke-linecap="round"
											stroke-linejoin="round"
											stroke-width="2"
											d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"
										/>
										<path
											stroke-linecap="round"
											stroke-linejoin="round"
											stroke-width="2"
											d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
										/>
									</svg>
								</button>
							</div>
						)}
					</For>
				</div>
			</div>
		</div>
	)
}
