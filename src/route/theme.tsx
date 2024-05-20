import { Title } from "@solidjs/meta"
import { JSX, Match, Show, Switch, splitProps } from "solid-js"
import { AppTheme, useAppState } from "~/state/app.state"

export default function () {
	const { theme, setTheme } = useAppState()
	return (
		<main>
			<Title>Theme</Title>
			<div
				class="grid h-auto grid-flow-col gap-4 py-4"
				style={{
					"grid-template-columns": "repeat(8, 1fr)",
					"grid-template-rows": "repeat(12, 1fr)",
				}}>
				<Switch>
					<Match when={theme() === AppTheme.light}>
						<button
							class="button"
							onClick={() => setTheme(AppTheme.dark)}>
							Light
						</button>
					</Match>
					<Match when={theme() === AppTheme.dark}>
						<button
							class="button"
							onClick={() => setTheme(AppTheme.light)}>
							Dark
						</button>
					</Match>
				</Switch>
				<button class="button">Borderless</button>
				<button class="button border-button">With Border</button>
				<button
					class="button"
					disabled>
					Disabled
				</button>
				<button class="button highlight-button">Highlight</button>
			</div>
		</main>
	)
}
