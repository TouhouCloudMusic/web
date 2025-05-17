import {
	type FieldElementProps,
	type FieldStore,
	FormError,
	valiForm,
	Form,
	Field,
	createFormStore,
	type SubmitHandler,
	type FormStore,
} from "@modular-forms/solid"
import { getRouteApi, Navigate, useNavigate } from "@tanstack/solid-router"
import {
	createEffect,
	createMemo,
	createSignal,
	Show,
	type ParentProps,
} from "solid-js"
import { FetchClient, AuthSchema } from "~/api"
import { Button } from "~/components/button"
import { Divider } from "~/components/divider"
import { Input } from "~/components/input"
import { useUserCtx } from "~/state/user"

export function Auth() {
	return (
		<Guard>
			<FormComp />
		</Guard>
	)
}

function Guard(props: ParentProps) {
	return (
		<Show
			when={!useUserCtx().is_signed_in}
			fallback={<Navigate to="/" />}
		>
			{props.children}
		</Show>
	)
}

const RouteApi = getRouteApi("/auth")

function FormComp() {
	type Mode = "sign_in" | "sign_up"

	let search_params = RouteApi.useSearch()

	let [mode, setMode] = createSignal<Mode>(search_params().type)
	let [showPassword, setShowPassword] = createSignal(false)
	let [showRepeatPassword, setShowRepeatPassword] = createSignal(false)
	let [rememberPassword, setRememberPassword] = createSignal(false)

	const form_store = createMemo(() => {
		if (mode() == "sign_in") {
			// @ts-ignore
			return createFormStore<AuthSchema.SignIn>({
				validate: valiForm(AuthSchema.SignIn),
			})
		} else {
			// @ts-ignore
			return createFormStore<AuthSchema.SignUp>({
				validate: valiForm(AuthSchema.SignUp),
			})
		}
	})

	createEffect(() => {
		setMode(search_params().type)
	})

	let user_ctx = useUserCtx()
	let nav = useNavigate()

	let handle_submit: SubmitHandler<AuthSchema.SignIn> = async (values, _) => {
		let { data, error } =
			mode() === "sign_in" ?
				await FetchClient.POST("/sign_in", {
					body: {
						username: values.username,
						password: values.password,
						remember: rememberPassword(),
					},
				})
				: await FetchClient.POST("/sign_up", {
					body: {
						username: values.username,
						password: values.password,
					},
				})

		if (error) {
			throw new FormError<AuthSchema.SignIn>(error.message)
		}

		if (data) {
			user_ctx.sign_in({
				user: data.data,
			})
			return nav({ to: "/" })
		}
	}

	return (
		<div class="h-screen w-screen flex items-center justify-center bg-gradient-to-br from-cyan-500 to-blue-600 overflow-hidden relative">
			{/* 背景几何形状装饰 */}
			<div class="absolute top-[10%] left-[10%] w-64 h-64 bg-cyan-300 rounded-full opacity-20 animate-pulse-slow"></div>
			<div class="absolute bottom-[15%] right-[15%] w-48 h-48 bg-blue-300 rounded-md rotate-45 opacity-20 animate-float"></div>
			<div class="absolute top-[40%] right-[20%] w-32 h-32 bg-cyan-200 rounded-full opacity-20 animate-pulse-slow"></div>
			<div class="absolute bottom-[30%] left-[15%] w-36 h-36 bg-blue-300 rounded-lg transform rotate-12 opacity-20 animate-float"></div>

			{/* 登录卡片 */}
			<div class="bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl p-8 w-[420px] flex flex-col">
				{/* 品牌区域 */}
				<div class="flex flex-col items-center justify-center mb-8">
					<div class="w-20 h-20 mb-3">
						<img src="/img/logo.png" alt="东方同音鉴" class="w-full h-full object-contain" />
					</div>
					<h1 class="text-2xl font-bold text-gray-800">东方同音鉴</h1>
					<p class="text-gray-500 text-sm mt-1">Touhou Cloud Music Database</p>
				</div>

				{/* 登录表单 */}
				<Form
					of={form_store() as FormStore<AuthSchema.SignIn>}
					datatype="application/json"
					onSubmit={handle_submit}
					class="w-full"
				>
					<Field
						of={form_store() as FormStore<AuthSchema.SignIn>}
						name="username"
					>
						{(field, props) => (
							<div class="mb-5">
								<div class="relative">
									<span class="absolute left-3 top-[13px] text-gray-400">
										<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
											<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
										</svg>
									</span>
									<input
										{...props}
										type="text"
										id="username"
										placeholder="请输入用户名"
										class="w-full border border-gray-300 rounded-lg py-3 px-10 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
									/>
								</div>
								{field.error && <span class="text-sm text-red-500 mt-1 block">{field.error}</span>}
							</div>
						)}
					</Field>

					<Field
						of={form_store() as FormStore<AuthSchema.SignIn>}
						name="password"
					>
						{(field, props) => (
							<div class="mb-6">
								<div class="relative">
									<span class="absolute left-3 top-[13px] text-gray-400">
										<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
											<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
										</svg>
									</span>
									<input
										{...props}
										type={showPassword() ? "text" : "password"}
										id="password"
										placeholder="请输入密码"
										class="w-full border border-gray-300 rounded-lg py-3 px-10 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
									/>
									<button
										type="button"
										class="absolute right-3 top-[13px] text-gray-400 hover:text-gray-600 transition-colors"
										onClick={() => setShowPassword(!showPassword())}
									>
										{showPassword() ? (
											<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
												<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
											</svg>
										) : (
											<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
												<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
												<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
											</svg>
										)}
									</button>
								</div>
								{field.error && <span class="text-sm text-red-500 mt-1 block">{field.error}</span>}
							</div>
						)}
					</Field>

					<Show when={mode() === "sign_up"}>
						<Field
							of={form_store() as FormStore<AuthSchema.SignUp>}
							name="repeated_password"
						>
							{(field, props) => (
								<div class="mb-6">
									<div class="relative">
										<span class="absolute left-3 top-[13px] text-gray-400">
											<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
												<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
											</svg>
										</span>
										<input
											{...props}
											type={showRepeatPassword() ? "text" : "password"}
											id="repeated_password"
											placeholder="请再次输入密码"
											class="w-full border border-gray-300 rounded-lg py-3 px-10 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
										/>
										<button
											type="button"
											class="absolute right-3 top-[13px] text-gray-400 hover:text-gray-600 transition-colors"
											onClick={() => setShowRepeatPassword(!showRepeatPassword())}
										>
											{showRepeatPassword() ? (
												<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
													<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
												</svg>
											) : (
												<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
													<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
													<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
												</svg>
											)}
										</button>
									</div>
									{field.error && <span class="text-sm text-red-500 mt-1 block">{field.error}</span>}
								</div>
							)}
						</Field>
					</Show>

					{/* 记住密码选项 - 仅在登录模式显示 */}
					<Show when={mode() === "sign_in"}>
						<div class="flex items-center mb-6">
							<input
								type="checkbox"
								id="remember"
								checked={rememberPassword()}
								onChange={(e) => setRememberPassword(e.target.checked)}
								class="h-4 w-4 rounded border-gray-300 text-reimu-600 focus:ring-reimu-500"
							/>
							<label for="remember" class="ml-2 block text-sm text-gray-700">
								记住密码
							</label>
						</div>
					</Show>

					<Show when={form_store().response.message}>
						<div class="text-sm text-red-500 p-3 bg-red-50 rounded-lg mb-4 border border-red-100">{form_store().response.message}</div>
					</Show>

					<button
						type="submit"
						class="bg-reimu-600 hover:bg-reimu-700 text-white py-3 px-4 rounded-lg w-full mb-4 transition-all duration-200 font-medium shadow-md hover:shadow-lg flex items-center justify-center"
					>
						<span class="mr-2 text-white">
							{mode() === "sign_in" ? (
								<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
									<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
								</svg>
							) : (
								<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
									<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
								</svg>
							)}
						</span>
						{mode() === "sign_in" ? "登录" : "注册"}
					</button>

					<div class="flex justify-between items-center text-sm mt-2">
						<a href="#" class="text-blue-600 hover:text-blue-800 hover:underline transition-all">
							前往后台管理系统
						</a>
						<a
							href="#"
							class="text-blue-600 hover:text-blue-800 hover:underline transition-all"
							onClick={(e) => {
								e.preventDefault();
								setMode(mode() === "sign_in" ? "sign_up" : "sign_in");
							}}
						>
							{mode() === "sign_in" ? "还没有账号？注册" : "已有账号？登录"}
						</a>
					</div>
				</Form>

				{/* 底部版权信息 */}
				<div class="mt-8 text-center text-xs text-gray-400">
					© {new Date().getFullYear()} Touhou Cloud Music Database. All rights reserved.
				</div>
			</div>
		</div>
	)
}

function FieldLayout(
	props: ParentProps<{
		label: string
		for: string
		error?: string
	}>,
) {
	return (
		<div class="flex flex-col gap-2">
			<label for={props.for}>{props.label}</label>
			{props.children}
			{props.error && <FieldError>{props.error}</FieldError>}
		</div>
	)
}

function FieldError(props: ParentProps) {
	return <span class="text-sm text-reimu-700">{props.children}</span>
}

function UserNameField(props: {
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

function PasswordField<T extends "password" | "repeated_password">(props: {
	name: T
	label: string
	field: T extends "password" ? FieldStore<AuthSchema.SignIn, T>
	: FieldStore<AuthSchema.SignUp, T>
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
