import { Title } from "@solidjs/meta"
import { Match, Show, Switch } from "solid-js"
import { AppTheme, useAppState } from "~/state/app.state"

export default function () {
	const { theme, setTheme } = useAppState()
	return (
		<main>
			<Title>Theme</Title>
			<div
				class="grid h-[100vh] gap-2 py-4"
				style={{
					"grid-template-columns": "repeat(10, minmax(0, 1fr))",
					"grid-template-rows": "repeat(24, minmax(0, 1fr))",
				}}>
				<Switch>
					<Match when={theme() === AppTheme.light}>
						<button
							onClick={() => setTheme(AppTheme.dark)}
							class="button dark">
							Dark
						</button>
					</Match>
					<Match when={theme() === AppTheme.dark}>
						<button
							onClick={() => setTheme(AppTheme.light)}
							class={`button light`}>
							Light
						</button>
					</Match>
				</Switch>
			</div>
		</main>
	)
}
