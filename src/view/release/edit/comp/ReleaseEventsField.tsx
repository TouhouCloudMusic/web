// 事件字段（受控组件）
import { Field } from "@formisch/solid"
import { Trans } from "@lingui-solid/solid/macro"
import { For } from "solid-js"
import { Cross1Icon } from "solid-radix-icons"
import { twMerge } from "tailwind-merge"

import { Button } from "~/component/atomic/button"
import { FormComp } from "~/component/atomic/form"
import { FieldArrayFallback } from "~/component/form/FieldArrayFallback"
import { EventSearchDialog } from "~/component/form/SearchDialog"

import { useReleaseFormContext } from "../store/context"
import { EventInfo } from "./EntityInfo"

export function ReleaseEventsField(props: { class?: string }) {
	const ctx = useReleaseFormContext()
	return (
		<div class={twMerge("flex min-h-32 flex-col", props.class)}>
			<div class="mb-4 flex place-content-between items-center gap-4">
				<FormComp.Label class="m-0">
					<Trans>Events</Trans>
				</FormComp.Label>
				<div class="flex gap-2">
					<EventSearchDialog onSelect={ctx.addEvent} />
				</div>
			</div>
			<ul class="flex h-full flex-col gap-2">
				<For
					each={ctx.events}
					fallback={<FieldArrayFallback />}
				>
					{(ev, idx) => (
						<li class="grid h-fit grid-cols-[1fr_auto]">
							<div class="text-sm text-slate-700">
								<EventInfo value={{ id: ev.id, name: ev.name }} />
							</div>

							<Field
								of={ctx.form}
								path={["data", "events", idx()]}
							>
								{(field) => (
									<input
										{...field.props}
										type="number"
										hidden
										value={field.input}
									/>
								)}
							</Field>
							<Button
								variant="Tertiary"
								size="Sm"
								onClick={ctx.removeEventAt(idx())}
							>
								<Cross1Icon />
							</Button>
						</li>
					)}
				</For>
			</ul>
		</div>
	)
}
