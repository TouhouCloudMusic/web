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
import { readLocalTheme } from "./state/theme"
import { storageTheme } from "./state/theme"
import { updateTheme } from "./state/theme"

function App() {
	const { theme, setTheme } = useAppState()
	onMount(() => {
		const localTheme = readLocalTheme() ?? AppTheme.light
		updateTheme(localTheme)
		setTheme(localTheme)
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
