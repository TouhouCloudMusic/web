import { For } from "solid-js"
import { localizedLanguageArray } from "~/lib/form/schema/language.ts"
import { type IndexComponentProps } from "~/lib/type/solid-js/jsx.ts"
import { useController } from "../../context.tsx"
import * as Style from "../style.ts"

export function LocalizedName() {
	const { FieldArray } = useController()
	return (
		<div class="flex flex-col">
			<h4 class={Style.label}>Localized Name</h4>
			<ul class="h-12 w-24">
				<FieldArray name="localized_name">
					{(fieldArray) => (
						<For each={fieldArray.items}>
							{(_, index) => <LoacalizedNameField index={index()} />}
						</For>
					)}
				</FieldArray>
			</ul>
		</div>
	)
}

function LoacalizedNameField(props: IndexComponentProps) {
	const { Field } = useController()
	return (
		<li class="flex flex-row">
			<Field name={`localized_name.${props.index}.name`}>
				{(field, props) => (
					<input
						type="text"
						value={field.value}
						{...props}
					/>
				)}
			</Field>
			<Field name={`localized_name.${props.index}.lang`}>
				{(field, props) => (
					<select {...props}>
						<For each={localizedLanguageArray}>
							{(item) => (
								<option
									value={item}
									selected={field.value === item}>
									{item}
								</option>
							)}
						</For>
					</select>
				)}
			</Field>
		</li>
	)
}
