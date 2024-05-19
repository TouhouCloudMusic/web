import { MetaProvider, Title } from "@solidjs/meta"
import { Router } from "@solidjs/router"
import { FileRoutes } from "@solidjs/start/router"
import { Suspense, createEffect, on } from "solid-js"
import "./app.css"
import { AppStateProvider, devAppState, useAppState } from "./state/app.state"
import Header from "~/component/Header/Header"
import { updateThemeVars } from "./style/theme/updateThemeVars"

function App() {
	const AppState = useAppState()
	createEffect(on(AppState.theme, () => updateThemeVars(AppState.theme())))
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
