import { Title } from "@solidjs/meta"
import { For, JSX, Match, Show, Switch, splitProps } from "solid-js"
import { AppTheme, useAppState } from "~/state/app.state"

export default function () {
	const { theme, setTheme } = useAppState()
	return (
		<main class="flex flex-col">
			<Title>Theme</Title>
			<div
				class="grid h-auto grid-flow-col gap-3 py-4 w-fit"
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
				<button class=" button px-3 py-1">Borderless</button>
				<button class=" border-button">With Border</button>
				<button
					class="button"
					disabled>
					Disabled
				</button>
				<button class=" highlight-button">Highlight</button>
			</div>
			<ColorPanel />
		</main>
	)
}

function ColorPanel() {
	const colorRowClass = "my-2 grid grid-cols-11 size-fit gap-2 rounded-md"

	const colorItemStyle: JSX.CSSProperties = {
		// "border-width": "1px",
		"border-radius": "0.25rem",
		height: "2.5rem",
		width: "4rem",
		// "box-shadow": "inset 0 1px 0 0 rgb(0 0 0 / 0.08)",
	}

	const colors = [
		"gray",
		"red",
		"orange",
		// "yellow",

		"green",

		"cyan",
		"blue",
		// "indigo",
		"purple",
		// "grape",
		"pink",
	]
	return (
		<main class="grid-row-10 grid grid-flow-row gap-2">
			<Title>Color Panel</Title>
			<div class="grid size-fit grid-cols-3 gap-2">
				<div class="place-content-center text-center">White</div>
				<div
					style={{ ...colorItemStyle, "background-color": "white" }}
				/>
				<div
					style={{
						...colorItemStyle,
						"background-color": `hsl(var(--white-100)`,
					}}
				/>
			</div>
			<For each={colors}>
				{(color) => (
					<>
						<div class={colorRowClass}>
							<div
								class="place-content-center text-center"
								style={{
									color: `hsl(var(--${color}-700))`,
								}}>
								{color[0].toUpperCase() + color.slice(1)}
							</div>
							<div
								style={{
									...colorItemStyle,
									"background-color": `hsl(var(--${color}-100))`,
								}}
							/>
							<div
								style={{
									...colorItemStyle,
									"background-color": `hsl(var(--${color}-200))`,
								}}
							/>
							<div
								style={{
									...colorItemStyle,
									"background-color": `hsl(var(--${color}-300))`,
								}}
							/>
							<div
								style={{
									...colorItemStyle,
									"background-color": `hsl(var(--${color}-400))`,
								}}
							/>
							<div
								style={{
									...colorItemStyle,
									"background-color": `hsl(var(--${color}-500))`,
								}}
							/>
							<div
								style={{
									...colorItemStyle,
									"background-color": `hsl(var(--${color}-600))`,
								}}
							/>
							<div
								style={{
									...colorItemStyle,
									"background-color": `hsl(var(--${color}-700))`,
								}}
							/>
							<div
								style={{
									...colorItemStyle,
									"background-color": `hsl(var(--${color}-800))`,
								}}
							/>
							<div
								style={{
									...colorItemStyle,
									"background-color": `hsl(var(--${color}-900))`,
								}}
							/>
							<div
								style={{
									...colorItemStyle,
									"background-color": `hsl(var(--${color}-1000)`,
								}}
							/>
						</div>
					</>
				)}
			</For>
		</main>
	)
}
