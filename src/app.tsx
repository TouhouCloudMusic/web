import { MetaProvider, Title } from "@solidjs/meta"
import { Router } from "@solidjs/router"
import { FileRoutes } from "@solidjs/start/router"
import { Suspense, createEffect, on, onMount } from "solid-js"
import "./app.css"
import {
	AppStateProvider,
	AppTheme,
	devAppState,
	useAppState,
} from "./state/app.state"

import Header from "~/component/Header/Header"

function updateTheme(theme: AppTheme) {
	function change(str: string) {
		document.getElementById("app")!.classList.add("notransition")
		document.documentElement.setAttribute("data-mode", str)
		setTimeout(() => {
			document.getElementById("app")!.classList.remove("notransition")
		}, 0)
	}
	switch (theme) {
		case AppTheme.light:
			change("light")
			break
		case AppTheme.dark:
			change("dark")
			break
		default:
			return -1
	}
	return 0
}

function storageTheme(theme: AppTheme) {
	localStorage.setItem("app_theme", theme.toString())
}

function readLocalTheme() {
	const localTheme = localStorage.getItem("app_theme")
	if (!localTheme) return
	if (!Object.values(AppTheme).includes(parseInt(localTheme, 10))) return
	else return parseInt(localTheme, 10)
}

function App() {
	const { theme, setTheme } = useAppState()
	onMount(() => {
		const theme = readLocalTheme() ?? AppTheme.light
		setTheme(theme)
	})
	createEffect(
		on(theme, () => {
			updateTheme(theme() ?? AppTheme.light)
			storageTheme(theme() ?? AppTheme.light)
		})
	)
	return (
		<Router
			root={(props) => (
				<MetaProvider>
					<Title>Doujin Cloud DB</Title>

					<Header />
					<Suspense>{props.children}</Suspense>
				</MetaProvider>
			)}>
			<FileRoutes />
		</Router>
	)
}

export default () => {
	return (
		<AppStateProvider defaultState={devAppState}>
			<App />
		</AppStateProvider>
	)
}
