// 发行类型字段
import { Field } from "@formisch/solid"
import { Trans } from "@lingui-solid/solid/macro"
import { For } from "solid-js"

import { FormComp } from "~/component/atomic/form"
import { RELEASE_TYPES } from "~/domain/release"

import type { ReleaseFormStore } from "./types"

export function ReleaseTypeField(props: { of: ReleaseFormStore }) {
	return (
		<Field
			of={props.of}
			path={["data", "release_type"]}
		>
			{(field) => (
				<div class="flex flex-col gap-1">
					<FormComp.Label>
						<Trans>Release Type</Trans>
					</FormComp.Label>
					<select
						{...field.props}
						class="h-9 rounded border border-slate-300 px-2"
						value={(field.input as string | undefined) ?? ""}
					>
						<option
							value=""
							disabled
						>
							<Trans>-- Please select artist type --</Trans>
						</option>
						<For each={RELEASE_TYPES}>
							{(rt) => <option value={rt}>{rt}</option>}
						</For>
					</select>
				</div>
			)}
		</Field>
	)
}
