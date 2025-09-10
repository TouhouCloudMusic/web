import { Trans } from "@lingui-solid/solid/macro"
import { useQuery } from "@tanstack/solid-query"
import { CreditApi, EventApi } from "@thc/api"
import { ArtistQueryOption, SongQueryOption } from "@thc/query"
import { Either, Option as O } from "effect"
import { Match, Switch } from "solid-js"

export function ArtistInfo(props: { id: () => number | undefined }) {
	const id = props.id
	const artistQuery = useQuery(() => ({
		...ArtistQueryOption.findById(id()!),
		enabled: Boolean(id()),
	}))

	return (
		<Switch>
			<Match when={!id()}>
				<span class="text-slate-400">
					<Trans>No artist selected</Trans>
				</span>
			</Match>
			<Match when={!artistQuery.data}>
				<span class="text-slate-400">...</span>
			</Match>
			<Match when={Boolean(artistQuery.data && O.isSome(artistQuery.data))}>
				<span class="inline-flex items-baseline gap-2">
					<span class="text-primary">
						{O.isSome(artistQuery.data!) ? artistQuery.data.value.name : ""}
					</span>
				</span>
			</Match>
			<Match when={Boolean(artistQuery.data && O.isNone(artistQuery.data))}>
				<span class="text-slate-400">
					<Trans>Artist not found</Trans>
				</span>
			</Match>
		</Switch>
	)
}

export function SongInfo(props: { id: () => number | undefined }) {
	const id = props.id
	const songQuery = useQuery(() => ({
		...SongQueryOption.findById(id()!),
		enabled: Boolean(id()),
	}))

	return (
		<Switch>
			<Match when={!id()}>
				<span class="text-slate-400">
					<Trans>No song selected</Trans>
				</span>
			</Match>
			<Match when={!songQuery.data}>
				<span class="text-slate-400">...</span>
			</Match>
			<Match when={Boolean(songQuery.data)}>
				<span class="inline-flex items-baseline gap-2">
					<span class="text-primary">{songQuery.data!.title}</span>
				</span>
			</Match>
		</Switch>
	)
}

export function EventInfo(props: { id: () => number | undefined }) {
	const id = props.id
	const eventQuery = useQuery(() => ({
		queryKey: ["event::byId", id()],
		queryFn: async () => {
			const res = await EventApi.findEventById({ path: { id: id()! } })
			return Either.getOrThrowWith(res, (e) => {
				throw e
			})
		},
		enabled: Boolean(id()),
	}))

	return (
		<Switch>
			<Match when={!id()}>
				<span class="text-slate-400">
					<Trans>No event selected</Trans>
				</span>
			</Match>
			<Match when={!eventQuery.data}>
				<span class="text-slate-400">...</span>
			</Match>
			<Match when={Boolean(eventQuery.data && O.isSome(eventQuery.data))}>
				<span class="inline-flex items-baseline gap-2">
					<span class="text-primary">
						{O.isSome(eventQuery.data!) ? eventQuery.data.value.name : ""}
					</span>
				</span>
			</Match>
			<Match when={Boolean(eventQuery.data && O.isNone(eventQuery.data))}>
				<span class="text-slate-400">
					<Trans>Event not found</Trans>
				</span>
			</Match>
		</Switch>
	)
}

export function CreditRoleInfo(props: { id: () => number | undefined }) {
	const id = props.id
	const roleQuery = useQuery(() => ({
		queryKey: ["credit-role::byId", id()],
		queryFn: async () => {
			const res = await CreditApi.findCreditRoleById({ path: { id: id()! } })
			return Either.getOrThrowWith(res, (e) => {
				throw e
			})
		},
		enabled: Boolean(id()),
	}))

	return (
		<Switch>
			<Match when={!id()}>
				<span class="text-slate-400">
					<Trans>No role selected</Trans>
				</span>
			</Match>
			<Match when={!roleQuery.data}>
				<span class="text-slate-400">...</span>
			</Match>
			<Match when={Boolean(roleQuery.data && O.isSome(roleQuery.data))}>
				<span class="inline-flex items-baseline gap-2">
					<span class="text-primary">
						{O.isSome(roleQuery.data!) ? roleQuery.data.value.name : ""}
					</span>
				</span>
			</Match>
			<Match when={Boolean(roleQuery.data && O.isNone(roleQuery.data))}>
				<span class="text-slate-400">
					<Trans>Role not found</Trans>
				</span>
			</Match>
		</Switch>
	)
}
