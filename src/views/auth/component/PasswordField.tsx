import { type FieldStore, type FieldElementProps } from "@modular-forms/solid"
import { AuthSchema } from "~/api"
import { Input } from "~/components/input"
import { FieldLayout } from "./FieldLayout"

export function PasswordField<T extends "password" | "repeated_password">(props: {
	name: T
	label: string
	field: T extends "password" ? FieldStore<AuthSchema.SignIn, T>
	:	FieldStore<AuthSchema.SignUp, T>
	props: FieldElementProps<AuthSchema.SignUp, T>
}) {
	return (
		<FieldLayout
			label={props.label}
			for={props.name}
			error={props.field.error}
		>
			<Input
				{...props.props}
				type="password"
				id={props.name}
			/>
		</FieldLayout>
	)
}