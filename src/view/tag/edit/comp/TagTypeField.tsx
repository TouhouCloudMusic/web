import { Field } from "@formisch/solid"
import { Trans } from "@lingui-solid/solid/macro"
import type { TagType } from "@thc/api"
import { For } from "solid-js"
import { twMerge } from "tailwind-merge"

import { FormComp } from "~/component/atomic/form"

import { useTagForm } from "../context"

const TAG_TYPES: TagType[] = ["Descriptor", "Genre", "Movement", "Scene"]

type Props = {
	class?: string
}

export function TagFormTypeField(props: Props) {
	const { formStore } = useTagForm()

	return (
		<Field
			of={formStore}
			path={["data", "type"]}
		>
			{(field) => (
				<div class={twMerge("flex flex-col", props.class)}>
					<FormComp.Label>
						<Trans>Tag Type</Trans>
					</FormComp.Label>
					<div class="rounded-sm border border-slate-300 font-light">
						<select
							{...field.props}
							class="box-border h-8 w-full rounded px-1 whitespace-nowrap focus:outline-1 focus:outline-reimu-600"
							value={field.input ?? ""}
						>
							<option value="">-- Please Select Type -- </option>
							<For each={TAG_TYPES}>
								{(type) => <option value={type}>{type}</option>}
							</For>
						</select>
					</div>
					<For each={field.errors}>
						{(error) => <FormComp.ErrorMessage>{error}</FormComp.ErrorMessage>}
					</For>
				</div>
			)}
		</Field>
	)
}
