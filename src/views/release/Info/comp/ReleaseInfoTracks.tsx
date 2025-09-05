import { For, Show } from "solid-js"

import { Duration } from "~/domain/shared"
import { assertContext } from "~/utils/solid/assertContext"

import { ReleaseInfoPageContext } from ".."

export function ReleaseInfoTracks() {
	const ctx = assertContext(ReleaseInfoPageContext)

	return (
		<Show
			when={ctx.release.tracks && ctx.release.tracks.length > 0}
			fallback={
				<div class="text-gray-500 mt-4 p-4 text-center">
					No tracks information available
				</div>
			}
		>
			<div class="mt-4 space-y-2">
				<h3 class="mb-3 text-lg font-semibold">Track List</h3>
				<div class="space-y-1">
					<For each={ctx.release.tracks}>
						{(track) => (
							<div class="hover:bg-gray-50 flex items-center rounded px-3 py-2">
								<span class="text-gray-400 mr-4 w-8 text-right text-sm">
									{track.track_number || "-"}
								</span>
								<div class="flex-1">
									<div class="text-gray-900 font-medium">
										{track.display_title || track.song.title}
									</div>
									<Show when={track.artists && track.artists.length > 0}>
										<div class="text-gray-600 text-sm">
											{track.artists!.map((artist) => artist.name).join(", ")}
										</div>
									</Show>
								</div>
								<Show when={track.duration}>
									<span class="text-gray-500 font-mono text-sm">
										{Duration.format(track.duration)}
									</span>
								</Show>
							</div>
						)}
					</For>
				</div>
			</div>
		</Show>
	)
}
