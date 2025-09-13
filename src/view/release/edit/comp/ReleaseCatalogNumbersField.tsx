// 目录号字段
import { Field, FieldArray } from "@formisch/solid"
import { Trans } from "@lingui-solid/solid/macro"
import { For, Show } from "solid-js"
import { Cross1Icon, PlusIcon } from "solid-radix-icons"
import { twMerge } from "tailwind-merge"

import { Button } from "~/component/atomic/button"
import { FormComp } from "~/component/atomic/form"
import { InputField } from "~/component/atomic/form/Input"
import { FieldArrayFallback } from "~/component/form/FieldArrayFallback"
import { LabelSearchDialog } from "~/component/form/SearchDialog"

import { useReleaseFormContext } from "../context"
import { LabelInfo } from "./EntityInfo"
import type { ReleaseFormStore } from "./types"

// oxlint-disable-next-line max-lines-per-function
export function ReleaseCatalogNumbersField(props: {
	of: ReleaseFormStore
	class?: string
}) {
	const ctx = useReleaseFormContext()

	return (
		<div class={twMerge("flex min-h-32 flex-col", props.class)}>
			<div class="mb-4 flex place-content-between items-center gap-4">
				<FormComp.Label class="m-0">
					<Trans>Catalog Numbers</Trans>
				</FormComp.Label>
				<Button
					variant="Tertiary"
					class="h-max p-2"
					onClick={ctx.addCatalogNumber}
				>
					<PlusIcon class="size-4" />
				</Button>
			</div>
			<ul class="flex h-full flex-col gap-2">
				<FieldArray
					of={props.of}
					path={["data", "catalog_nums"]}
				>
					{(fa) => (
						<For
							each={fa.items}
							fallback={<FieldArrayFallback />}
						>
							{(_, idx) => (
								<li class="grid grid-cols-[1fr_auto_auto] gap-2">
									<Field
										of={props.of}
										path={["data", "catalog_nums", idx(), "catalog_number"]}
									>
										{(field) => (
											<InputField.Root>
												<InputField.Input
													{...field.props}
													placeholder="Catalog No."
													value={field.input}
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
											<>
												<input
													{...field.props}
													type="number"
													hidden
													value={field.input ?? undefined}
												/>
												<div class="flex items-center gap-2">
													<div class="text-sm text-slate-700">
														<Show
															when={ctx.catalogLabels[idx()]}
															fallback={
																<span class="text-slate-400">
																	<Trans>No label selected</Trans>
																</span>
															}
														>
															{(lbl) => <LabelInfo value={lbl()} />}
														</Show>
													</div>

													<LabelSearchDialog
														onSelect={ctx.setCatalogLabel(idx())}
													/>
												</div>
											</>
										)}
									</Field>

									<Button
										variant="Tertiary"
										size="Sm"
										onClick={ctx.removeCatalogNumberAt(idx())}
									>
										<Cross1Icon />
									</Button>
								</li>
							)}
						</For>
					)}
				</FieldArray>
			</ul>
		</div>
	)
}
