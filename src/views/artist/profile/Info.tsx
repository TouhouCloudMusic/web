import { useLingui } from "@lingui-solid/solid/macro"
import { createMemo, Show, For, ParentProps } from "solid-js"

import type { Artist } from "~/api/artist"
import { ArtistType } from "~/api/artist/schema"
import type { DateWithPrecision } from "~/api/share/schema"

function InfoLabel(props: ParentProps) {
	return <span class="text-sm text-secondary">{props.children}</span>
}

export function Info(props: { artist: Artist }) {
	const { t } = useLingui()
	return (
		<div class="flex flex-col space-y-4">
			<h1 class="font-semibold text-xl">{props.artist.name}</h1>
			<Show when={props.artist.artist_type !== "Unknown"}>
				<div class="">
					<DateInfo
						value={props.artist.start_date}
						label={props.artist.artist_type == "Solo" ? t`Born` : t`Formed`}
					/>
				</div>
				<div>
					<DateInfo
						value={props.artist.end_date}
						label={props.artist.artist_type == "Solo" ? t`Died` : t`Disbanded`}
					/>
				</div>
			</Show>
			<Location location={props.artist.start_location} />
			<Aliases artist={props.artist} />
			<Membership artist={props.artist} />
		</div>
	)
}

function Aliases(props: { artist: Artist }) {
	const { t } = useLingui()
	const aliases = createMemo(() => {
		type Alias = {
			id?: number
			name?: string
		}
		let ret: Alias[] = []
		if (props.artist.aliases) {
			for (const aliasId of props.artist.aliases) {
				ret.push({
					id: aliasId,
				})
			}
		}

		if (props.artist.text_aliases) {
			for (const alias of props.artist.text_aliases) {
				ret.push({
					name: alias,
				})
			}
		}

		return ret
	})
	return (
		<div>
			<InfoLabel>{t`Aliases`}</InfoLabel>
			<ul class="flex flex-row gap-1">
				<For each={aliases()}>
					{(alias, index) => (
						<>
							<li>
								<Show
									when={alias.id}
									fallback={alias.name}
								>
									{alias.id}
								</Show>
								<Show when={aliases().length - 1 > index()}>{", "}</Show>
							</li>
						</>
					)}
				</For>
			</ul>
		</div>
	)
}

function Membership(props: { artist: Artist }) {
	const { t } = useLingui()
	const label = createMemo(() => {
		switch (props.artist.artist_type) {
			case "Solo":
				return t`Member Of`
			case "Multiple":
				return t`Members`
			default:
				throw new Error("Unreachable")
		}
	})
	return (
		<Show
			when={
				props.artist.artist_type !== "Unknown" &&
				props.artist.memberships?.length
			}
		>
			<div>
				<span class="text-sm text-secondary">{label()}</span>
				<ul>
					<For each={props.artist.memberships}>
						{(membership) => <li>{membership.artist_id}</li>}
					</For>
				</ul>
			</div>
		</Show>
	)
}

function Location(props: { location?: Artist["start_location"] }) {
	return (
		<Show when={props.location?.country}>
			<div>
				{props.location!.country}
				{props.location!.province && <>, {props.location!.province}</>}
				{props.location!.city && <>, {props.location!.city}</>}
			</div>
		</Show>
	)
}

function DateInfo(props: { value?: Artist["start_date"]; label: string }) {
	const parsedDate = createMemo(() => {
		if (!props.value) {
			return undefined
		}
		const [year, month, day] = props.value.value.split("-")
		if (props.value.precision == "Year") {
			return year!
		} else if (props.value.precision == "Month") {
			return `${year!}-${month!}`
		} else {
			return `${year!}-${month!}-${day!}`
		}
	})
	return (
		<Show when={props.value}>
			<div class="flex flex-col">
				<InfoLabel>{props.label}</InfoLabel>
				<span class="text-slate-1000">{parsedDate()}</span>
			</div>
		</Show>
	)
}
