import {
	createFormStore,
	FormError,
	valiForm,
	type SubmitHandler,
	type FormStore,
} from "@modular-forms/solid"
import { getRouteApi, useNavigate } from "@tanstack/solid-router"
import { AuthApi } from "@thc/api"
import { createEffect, createMemo, createSignal } from "solid-js"

import * as AuthSchema from "~/domain/auth/schema"
import { useCurrentUser } from "~/state/user"

export type AuthFormMode = "sign_in" | "sign_up"

const RouteApi = getRouteApi("/auth")

export function useAuthForm() {
	const searchParams = RouteApi.useSearch()
	const [mode, setMode] = createSignal<AuthFormMode>(searchParams().type)

	createEffect(() => {
		setMode(searchParams().type)
	})

	const formStore = createMemo(() => {
		if (mode() == "sign_in") {
			return createFormStore<AuthSchema.SignIn>({
				validate: valiForm(AuthSchema.SignIn),
			}) as FormStore<AuthSchema.SignIn>
		}
		return createFormStore<AuthSchema.SignUp>({
			validate: valiForm(AuthSchema.SignUp),
		}) as FormStore<AuthSchema.SignUp>
	})

	const userCtx = useCurrentUser()
	const nav = useNavigate()

	const handleSubmit: SubmitHandler<AuthSchema.SignIn> = async (values, _) => {
		const result =
			mode() === "sign_in" ?
				await AuthApi.signin({
					body: {
						username: values.username,
						password: values.password,
					},
				})
			:	await AuthApi.signup({
					body: {
						username: values.username,
						password: values.password,
					},
				})

		if (result.status === "Err") {
			throw new FormError<AuthSchema.SignIn>(result.error.message)
		}

		if (result.status === "Ok" && result.data) {
			userCtx.sign_in({
				user: result.data,
			})
			return nav({ to: "/" })
		}
	}

	return {
		mode,
		setMode,
		formStore: formStore,
		handleSubmit: handleSubmit,
	}
}
