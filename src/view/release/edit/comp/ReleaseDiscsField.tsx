// 光盘信息字段
import { Field, FieldArray, insert, remove } from "@formisch/solid"
import { Trans } from "@lingui-solid/solid/macro"
import { For } from "solid-js"
import { Cross1Icon, PlusIcon } from "solid-radix-icons"

import { Button } from "~/component/atomic/button"
import { FormComp } from "~/component/atomic/form"
import { InputField } from "~/component/atomic/form/Input"

import type { ReleaseFormStore } from "./types"

export function ReleaseDiscsField(props: { of: ReleaseFormStore }) {
	return (
		<FieldArray
			of={props.of}
			path={["data", "discs"]}
		>
			{(fa) => (
				<div class="flex min-h-32 w-96 flex-col">
					<div class="mb-4 flex place-content-between items-center gap-4">
						<FormComp.Label class="m-0">
							<Trans>Discs</Trans>
						</FormComp.Label>
						<Button
							variant="Tertiary"
							class="h-max p-2"
							onClick={() =>
								insert(props.of, {
									path: ["data", "discs"],
									initialInput: { name: "" } as unknown as { name?: string },
								})
							}
						>
							<PlusIcon class="size-4" />
						</Button>
					</div>
					<ul class="flex h-full flex-col gap-2">
						<For each={fa.items}>
							{(_, idx) => (
								<li class="grid grid-cols-[1fr_auto] gap-2">
									<Field
										of={props.of}
										path={["data", "discs", idx(), "name"]}
									>
										{(field) => (
											<InputField.Root>
												<InputField.Input
													{...field.props}
													placeholder="Disc name"
													value={field.input as string | undefined}
												/>
												<InputField.Error>
													{field.errors ? field.errors[0] : undefined}
												</InputField.Error>
											</InputField.Root>
										)}
									</Field>
									<Button
										variant="Tertiary"
										size="Sm"
										onClick={() =>
											remove(props.of, { path: ["data", "discs"], at: idx() })
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
