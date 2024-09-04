import { Title } from "@solidjs/meta"
import { Router } from "@solidjs/router"
import { FileRoutes } from "@solidjs/start/router"
import { ErrorBoundary, type ParentProps, Show } from "solid-js"
import { Header } from "~/component/header/header.tsx"
import "./app.css"
import ErrorPage from "./route/500"
import { useI18N } from "./state/i18n"
import { Providers } from "./state/index.tsx"

function Routes() {
	return (
		<Router
			root={(props) => (
				<>
					<Title>Doujin Cloud DB</Title>
					<Header />
					<div class="border-t">{props.children}</div>
				</>
			)}>
			<CustomErrorBoundary>
				<FileRoutes />
			</CustomErrorBoundary>
		</Router>
	)
}

function CustomErrorBoundary(props: ParentProps) {
	return (
		<Show
			when={import.meta.env.DEV}
			fallback={
				<ErrorBoundary
					fallback={(e: Error) => (
						<>
							<ErrorPage msg={e.stack} />
						</>
					)}>
					{props.children}
				</ErrorBoundary>
			}>
			{props.children}
		</Show>
	)
}

export default function App() {
	return (
		<Providers>
			<div
				class="min-h-full"
				style={
					useI18N().duringTransition() ?
						{
							transition: "color .3s",
							"transition-delay": ".1s",
							"transition-timing-function": "ease-in",
						}
					:	undefined
				}>
				<Routes />
			</div>
		</Providers>
	)
}
