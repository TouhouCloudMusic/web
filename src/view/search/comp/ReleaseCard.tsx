import type { Component } from "solid-js"

type ReleaseCardProps = {
	name: string
	type: string
}

export const ReleaseCard: Component<ReleaseCardProps> = (props) => {
	return (
		<div class="flex gap-3 p-2 rounded-lg hover:bg-slate-100">
			<img
				src="https://img.paulzzh.com/touhou/random"
				alt={props.name}
				class="size-16 shrink-0 rounded-lg bg-slate-200 object-cover"
			/>
			<div class="flex min-w-0 flex-1 flex-col justify-center gap-1">
				<div class="truncate text-sm font-medium text-slate-800">
					{props.name}
				</div>
				<div class="truncate text-xs text-slate-600">
					{props.type}
				</div>
				<div class="truncate text-xs text-slate-500">
					Placeholder extra info
				</div>
			</div>
		</div>
	)
}
