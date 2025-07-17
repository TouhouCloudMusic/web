import { Link } from "@tanstack/solid-router"
import { For } from "solid-js"

import type { CreditRole } from "~/api/credit"
import type { GroupedSongCredit } from "~/domain/song"

export function CreditList(props: { credits: GroupedSongCredit[] }) {
	return (
		<For each={props.credits}>
			{(credit) => (
				<li class="flex flex-col">
					{/* TODO: Styled link */}
					<Link
						to={"/artist/$id"}
						params={{
							id: credit.artist.id.toString(),
						}}
						class="font-medium text-slate-900 hover:underline"
					>
						{credit.artist.name}
					</Link>
					<CreditRoleList roles={credit.roles} />
				</li>
			)}
		</For>
	)
}

function CreditRoleList(props: { roles: CreditRole[] }) {
	return (
		<ul class="flex flex-wrap text-sm text-secondary">
			<For each={props.roles}>
				{(role, index) => (
					<li>
						{/* TODO: Link to credit page */}
						<span class="hover:underline">{role.name}</span>
						{index() + 1 < props.roles.length && <span>,&nbsp;</span>}
					</li>
				)}
			</For>
		</ul>
	)
}
