import { Link } from "@tanstack/solid-router"
import { For, Show } from "solid-js"

import { assertContext } from "~/utils/solid/assertContext"

import { ReleaseInfoPageContext } from ".."

export function ReleaseInfoCredits() {
	const ctx = assertContext(ReleaseInfoPageContext)

	return (
		<Show
			when={ctx.release.credits && ctx.release.credits.length > 0}
			fallback={
				<div class="mt-4 p-4 text-center text-slate-500">
					No credits information available
				</div>
			}
		>
			<div class="mt-4 space-y-4">
				<h3 class="mb-3 text-lg font-semibold">Credits</h3>
				<div class="space-y-3">
					<For each={ctx.release.credits}>
						{(credit) => (
							<div class="hover:bg-slate-50 flex items-start rounded px-3 py-2">
								<div class="flex-1">
									<Link
										to="/artist/$id"
										params={{ id: credit.artist.id.toString() }}
										class="font-medium text-slate-900 underline-offset-4 transition-colors hover:text-primary hover:underline"
									>
										{credit.artist.name}
									</Link>
									<div class="mt-1 text-sm text-slate-600">
										{credit.role.name}
									</div>
									<Show when={credit.on && credit.on.length > 0}>
										<div class="mt-1 text-xs text-slate-400">
											On tracks: {credit.on!.join(", ")}
										</div>
									</Show>
								</div>
							</div>
						)}
					</For>
				</div>
			</div>
		</Show>
	)
}
