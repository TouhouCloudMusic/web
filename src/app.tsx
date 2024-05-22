import { MetaProvider, Title } from "@solidjs/meta"
import { Router } from "@solidjs/router"
import { FileRoutes } from "@solidjs/start/router"
import { Suspense, createEffect, createResource, on } from "solid-js"
import "./app.css"
import {
	AppStateProvider,
	AppTheme,
	devAppState,
	useAppState,
} from "./state/app.state"
import Header from "~/component/Header/Header"
import { getCookieTheme, setCookieTheme } from "./state/theme"
import { updateTheme } from "./state/theme"

function App() {
	const { theme, setTheme } = useAppState()
	createEffect(
		on(theme, () => {
			updateTheme(theme() ?? AppTheme.light)
			setCookieTheme(theme() ?? AppTheme.light)
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
	const [appState] = createResource(() => getCookieTheme() ?? AppTheme.light)
	const initTheme = parseInt(appState()?.toString() ?? "0", 10)
	return (
		<Suspense>
			<AppStateProvider
				defaultState={{ ...devAppState, theme: initTheme }}>
				<App />
			</AppStateProvider>
		</Suspense>
	)
}
