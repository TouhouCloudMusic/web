import type { DatePrecision } from "@thc/api"
import { Match } from "effect"
import { For, Show } from "solid-js"

import { getPreferredLocalizedTitle } from "~/utils"
import { assertContext } from "~/utils/solid/assertContext"

import { ReleaseInfoPageContext } from ".."

const getOpt = Match.type<DatePrecision>().pipe(
	Match.withReturnType<Intl.DateTimeFormatOptions>(),
	Match.when("Year", () => ({ year: "numeric" })),
	Match.when("Month", () => ({
		year: "numeric",
		month: "long",
	})),
	Match.when("Day", () => ({
		year: "numeric",
		month: "long",
		day: "numeric",
	})),
	Match.when(Match.undefined, () => ({
		year: "numeric",
		month: "long",
		day: "numeric",
	})),
	Match.exhaustive,
)

function formatDate(dateString: string, precision: DatePrecision): string
function formatDate(dateString?: null, precision?: null): undefined
function formatDate(
	dateString?: string | null,
	precision?: DatePrecision | null,
): string | undefined
function formatDate(
	dateString?: string | null,
	precision?: DatePrecision | null,
): string | undefined {
	if (!dateString || !precision) return

	const date = new Date(dateString)

	return date.toLocaleDateString(undefined, getOpt(precision))
}

export function ReleaseInfoDetails() {
	const ctx = assertContext(ReleaseInfoPageContext)

	const preferredLocalizedTitle = getPreferredLocalizedTitle(
		ctx.release.localized_titles,
	)

	return (
		<div class="space-y-3 text-sm">
			<Show when={ctx.release.release_date}>
				<div class="flex">
					<span class="w-20 text-slate-500">Released:</span>
					<span class="text-slate-900">
						{formatDate(
							ctx.release.release_date,
							ctx.release.release_date_precision,
						)}
					</span>
				</div>
			</Show>

			<Show
				when={
					ctx.release.recording_date_start || ctx.release.recording_date_end
				}
			>
				<div class="flex">
					<span class="w-20 text-slate-500">Recorded:</span>
					<div class="space-y-1">
						<Show when={ctx.release.recording_date_start}>
							<div>
								From:{" "}
								{formatDate(
									ctx.release.recording_date_start,
									ctx.release.recording_date_start_precision,
								)}
							</div>
						</Show>
						<Show when={ctx.release.recording_date_end}>
							<div>
								To:{" "}
								{formatDate(
									ctx.release.recording_date_end,
									ctx.release.recording_date_end_precision,
								)}
							</div>
						</Show>
					</div>
				</div>
			</Show>

			<Show
				when={ctx.release.catalog_nums && ctx.release.catalog_nums.length > 0}
			>
				<div class="flex">
					<span class="w-20 text-slate-500">Catalog:</span>
					<div class="space-y-1">
						<For each={ctx.release.catalog_nums}>
							{(catalog) => (
								<div class="flex items-center space-x-2">
									<span class="bg-slate-50 rounded px-1 font-mono text-xs">
										{catalog.catalog_number}
									</span>
								</div>
							)}
						</For>
					</div>
				</div>
			</Show>

			<Show when={preferredLocalizedTitle}>
				<div class="flex">
					<span class="w-20 text-slate-500">Localized:</span>
					<span class="text-slate-900">
						{preferredLocalizedTitle?.title}
						{preferredLocalizedTitle?.language && (
							<span class="ml-2 text-xs text-slate-500">
								({preferredLocalizedTitle.language.name})
							</span>
						)}
					</span>
				</div>
			</Show>
		</div>
	)
}
