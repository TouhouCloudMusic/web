import { type FieldStore, type FieldElementProps } from "@modular-forms/solid"
import { AuthSchema } from "~/api"
import { Input } from "~/components/input"
import { FieldLayout } from "./FieldLayout"

export function UserNameField(props: {
	field: FieldStore<AuthSchema.SignIn, "username">
	props: FieldElementProps<AuthSchema.SignIn, "username">
}) {
	return (
		<FieldLayout
			label="Username"
			for="username"
			error={props.field.error}
		>
			<Input
				{...props.props}
				type="text"
				id="username"
			/>
		</FieldLayout>
	)
}