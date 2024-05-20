import { Title } from "@solidjs/meta"
import { For, JSX } from "solid-js"

export default function colorPanel() {
	const colorRowClass = "my-2 grid grid-cols-11 size-fit gap-2 rounded-md"

	const colorItemStyle: JSX.CSSProperties = {
		"border-width": "1px",
		"border-radius": "0.25rem",
		height: "2.5rem",
		width: "4rem",
		"border-color": "hsl(var(--gray-400))",
	}

	const colors = ["gray", "blue", "red", "green"]
	return (
		<main class="grid-row-10 grid grid-flow-row gap-4">
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
						"border-color": `hsl(var(--gray-300))`,
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
