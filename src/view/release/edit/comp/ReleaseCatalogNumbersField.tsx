// 目录号字段
import { Field, FieldArray, insert, remove, setInput } from "@formisch/solid"
import { Trans } from "@lingui-solid/solid/macro"
import { useQuery } from "@tanstack/solid-query"
import { LabelQueryOption } from "@thc/query"
import { Option as O } from "effect"
import { For } from "solid-js"
import { Cross1Icon, PlusIcon } from "solid-radix-icons"

import { Button } from "~/component/atomic/button"
import { FormComp } from "~/component/atomic/form"
import { InputField } from "~/component/atomic/form/Input"
import { LabelSearchDialog } from "~/component/form/SearchDialog"

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
													value={field.input as string | undefined}
												/>
												<InputField.Error>
													{field.errors ? field.errors[0] : undefined}
												</InputField.Error>
											</InputField.Root>
										)}
									</Field>

									{/* 以对话框搜索选择 Label，移除手填 ID */}
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
													value={field.input as number | undefined}
												/>
												<div class="flex items-center gap-2">
													<div class="text-sm text-slate-700">
														<LabelInfo
															id={() => field.input as number | undefined}
														/>
													</div>

													<LabelSearchDialog
														onSelect={(label) =>
															setInput(props.of, {
																path: [
																	"data",
																	"catalog_nums",
																	idx(),
																	"label_id",
																],
																input: label.id,
															})
														}
													/>
												</div>
											</>
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

// 行内标签信息展示：优先显示标签名称，回退到“未选择”或“未找到”。
function LabelInfo(props: { id: () => number | undefined }) {
	const id = props.id
	const labelQuery = useQuery(() => ({
		...LabelQueryOption.findById(id()!),
		enabled: Boolean(id()),
	}))

	const render = () => {
		const v = id()
		if (!v)
			return (
				<span class="text-slate-400">
					<Trans>No label selected</Trans>
				</span>
			)
		const data = labelQuery.data
		if (!data) return <span class="text-slate-400">...</span>
		return O.match(data, {
			onSome: (label) => (
				<span class="inline-flex items-baseline gap-2">
					<span class="text-primary">{label.name}</span>
					<span class="text-xs text-slate-400">ID: {label.id}</span>
				</span>
			),
			onNone: () => (
				<span class="text-slate-400">
					<Trans>Label not found</Trans>
				</span>
			),
		})
	}

	return render()
}
