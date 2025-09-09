// 标题字段
import { Field } from "@formisch/solid"
import { Trans } from "@lingui-solid/solid/macro"

import { FormComp } from "~/component/atomic/form"
import { InputField } from "~/component/atomic/form/Input"

import type { ReleaseFormStore } from "./types"

export function TitleField(props: { of: ReleaseFormStore }) {
	return (
		<Field
			of={props.of}
			path={["data", "title"]}
		>
			{(field) => (
				<InputField.Root>
					<FormComp.Label>
						<Trans>Title</Trans>
					</FormComp.Label>
					<InputField.Input
						{...field.props}
						id={
							Array.isArray(field.path)
								? field.path.join(".")
								: String(field.path)
						}
						placeholder="Title"
						value={field.input as string | undefined}
					/>
					<InputField.Error>
						{field.errors ? field.errors[0] : undefined}
					</InputField.Error>
				</InputField.Root>
			)}
		</Field>
	)
}
