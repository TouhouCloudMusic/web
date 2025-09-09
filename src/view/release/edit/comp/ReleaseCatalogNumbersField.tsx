// 目录号字段
import { Field, FieldArray, insert, remove } from "@formisch/solid"
import { Trans } from "@lingui-solid/solid/macro"
import { For } from "solid-js"
import { Cross1Icon, PlusIcon } from "solid-radix-icons"

import { Button } from "~/component/atomic/button"
import { FormComp } from "~/component/atomic/form"
import { InputField } from "~/component/atomic/form/Input"

import type { ReleaseFormStore } from "./types"

export function ReleaseCatalogNumbersField(props: { of: ReleaseFormStore }) {
	return (
		<FieldArray
			of={props.of}
			path={["data", "catalog_nums"]}
		>
			{(fa) => (
				<div class="flex min-h-32 w-96 flex-col">
					<div class="mb-4 flex place-content-between items-center gap-4">
						<FormComp.Label class="m-0">
							<Trans>Catalog Numbers</Trans>
						</FormComp.Label>
						<Button
							variant="Tertiary"
							class="h-max p-2"
							onClick={() =>
								insert(props.of, {
									path: ["data", "catalog_nums"],
									initialInput: {
										catalog_number: "",
										label_id: undefined,
									} as unknown as { catalog_number: string; label_id?: number },
								})
							}
						>
							<PlusIcon class="size-4" />
						</Button>
					</div>
					<ul class="flex h-full flex-col gap-2">
						<For each={fa.items}>
							{(_, idx) => (
								<li class="grid grid-cols-[1fr_1fr_auto] gap-2">
									<Field
										of={props.of}
										path={["data", "catalog_nums", idx(), "catalog_number"]}
									>
										{(field) => (
											<InputField.Root>
												<InputField.Input
													{...field.props}
													placeholder="Catalog No."
													value={field.input as string | undefined}
												/>
												<InputField.Error>
													{field.errors ? field.errors[0] : undefined}
												</InputField.Error>
											</InputField.Root>
										)}
									</Field>

									<Field
										of={props.of}
										path={["data", "catalog_nums", idx(), "label_id"]}
									>
										{(field) => (
											<InputField.Root>
												<InputField.Input
													{...field.props}
													placeholder="Label ID (optional)"
													type="number"
													value={field.input as number | undefined}
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
											remove(props.of, {
												path: ["data", "catalog_nums"],
												at: idx(),
											})
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
