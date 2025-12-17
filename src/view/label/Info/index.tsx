import type { Label } from "@thc/api"
import { For, Show } from "solid-js"

import { DateWithPrecision } from "~/domain/shared"
import { PageLayout } from "~/layout/PageLayout"

type LabelInfoPageProps = {
	label: Label
}

const getLabelStatusText = (label: Label) => {
	return label.dissolved_date ? "Dissolved" : "Active"
}

export function LabelInfoPage(props: LabelInfoPageProps) {
	return (
		<PageLayout class="p-8">
			<div class="flex flex-col gap-y-6">
				<header class="space-y-2">
					<div class="flex flex-wrap items-center gap-3">
						<h1 class="text-3xl font-light tracking-tight text-primary">
							{props.label.name}
						</h1>
						<div class="rounded-full border border-slate-200 bg-white px-2 py-0.5 text-xs text-slate-600">
							{getLabelStatusText(props.label)}
						</div>
					</div>
				</header>

				<div class="grid grid-cols-[auto_1fr] gap-x-4 gap-y-3 text-sm">
					<div class="text-tertiary">Founded</div>
					<div>
						{DateWithPrecision.display(props.label.founded_date) ?? "Unknown"}
					</div>

					<div class="text-tertiary">Dissolved</div>
					<div>
						{DateWithPrecision.display(props.label.dissolved_date) ?? "—"}
					</div>

					<div class="text-tertiary">Founders</div>
					<div>{props.label.founders?.length ?? 0}</div>

					<Show
						when={
							props.label.localized_names
							&& 0 < props.label.localized_names.length
						}
					>
						<div class="text-tertiary">Localized Names</div>
						<ul class="flex flex-wrap gap-1">
							<For each={props.label.localized_names}>
								{(item) => (
									<li class="rounded-md border border-slate-200 bg-white px-2 py-1 text-xs text-slate-700">
										{item.language.name}: {item.name}
									</li>
								)}
							</For>
						</ul>
					</Show>
				</div>
			</div>
		</PageLayout>
	)
}
