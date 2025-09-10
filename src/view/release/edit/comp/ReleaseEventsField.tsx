// 事件字段
import { Field, FieldArray, insert, remove } from "@formisch/solid"
import { Trans } from "@lingui-solid/solid/macro"
import { For } from "solid-js"
import { Cross1Icon } from "solid-radix-icons"
import { twMerge } from "tailwind-merge"

import { Button } from "~/component/atomic/button"
import { FormComp } from "~/component/atomic/form"
import { EventSearchDialog } from "~/component/form/SearchDialog"

import { EventInfo } from "./EntityInfo"
import type { ReleaseFormStore } from "./types"

export function ReleaseEventsField(props: {
	of: ReleaseFormStore
	class?: string
}) {
	return (
		<FieldArray
			of={props.of}
			path={["data", "events"]}
		>
			{(fa) => (
				<div class={twMerge("flex min-h-32 w-96 flex-col", props.class)}>
					<div class="mb-4 flex place-content-between items-center gap-4">
						<FormComp.Label class="m-0">
							<Trans>Events</Trans>
						</FormComp.Label>
						<div class="flex gap-2">
							<EventSearchDialog
								onSelect={(ev) =>
									insert(props.of, {
										path: ["data", "events"],
										initialInput: ev.id,
									})
								}
							/>
						</div>
					</div>
					<ul class="flex h-full flex-col gap-2">
						<For each={fa.items}>
							{(_, idx) => (
								<li class="grid h-fit grid-cols-[1fr_auto]">
									<Field
										of={props.of}
										path={["data", "events", idx()]}
									>
										{(field) => (
											<>
												<input
													{...field.props}
													type="number"
													hidden
													value={field.input as number | undefined}
												/>
												<div class="text-sm text-slate-700">
													<EventInfo
														id={() => field.input as number | undefined}
													/>
												</div>
											</>
										)}
									</Field>
									<Button
										variant="Tertiary"
										size="Sm"
										onClick={() =>
											remove(props.of, { path: ["data", "events"], at: idx() })
										}
									>
										<Cross1Icon />
									</Button>
								</li>
							)}
						</For>
					</ul>
				</div>
			)}
		</FieldArray>
	)
}
