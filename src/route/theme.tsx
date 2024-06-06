import { Title } from "@solidjs/meta"
import { For, JSX } from "solid-js"
import { ThemeButton } from "~/component/themeButton"
import { A } from "@solidjs/router"
export default function () {
	return (
		<main class="flex flex-col items-center justify-center place-content-center">
			<Title>Theme</Title>
			<div class="my-4">
				<ColorPanel />
			</div>
			<div
				class="grid h-auto grid-flow-col gap-3 py-4 w-fit "
				style={{
					"grid-template-columns": "repeat(8, 1fr)",
					"grid-template-rows": "repeat(12, 1fr)",
				}}>
				<Buttons />
				<Links />
			</div>
		</main>
	)
}

function ColorPanel() {
	const colorItemStyle: JSX.CSSProperties = {
		"border-radius": "0.25rem",
		height: "2.5rem",
		width: "4rem",
	}

	const colors = [
		"gray",
		"red",
		"orange",
		"green",
		"cyan",
		"blue",
		"purple",
		"pink",
	]

	return (
		<div class="grid-row-10 grid grid-flow-row gap-2">
			<div class="grid size-fit grid-cols-3 gap-2">
				<div class="place-content-center text-center text-gray-1000">Bg</div>
				<div
					style={{
						...colorItemStyle,
						"background-color": "hsl(var(--bg-main))",
						"box-shadow": "var(--shadow-3)",
					}}></div>
				<div
					style={{
						...colorItemStyle,
						"background-color": `hsl(var(--bg-highlight))`,
						"box-shadow": "var(--shadow-3)",
					}}></div>
			</div>
			<For each={colors}>
				{(color) => (
					<>
						<div class="my-2 grid grid-flow-col grid-cols-12 grid-rows-1 size-fit gap-2 rounded-md">
							<div
								class="place-content-center text-center"
								style={{
									color: `hsl(var(--${color}-800))`,
								}}>
								{color[0].toUpperCase() + color.slice(1)}
							</div>
							<For each={new Array(10)}>
								{(_, idx) => (
									<>
										<div
											style={{
												...colorItemStyle,
												"background-color": `hsl(var(--${color}-${(idx() + 1) * 100}))`,
											}}></div>
									</>
								)}
							</For>
						</div>
					</>
				)}
			</For>
		</div>
	)
}

function Buttons() {
	return (
		<>
			<div class="items-center text-center font-bold row-span-12 grid-rows-subgrid grid">
				<div>Button</div>
			</div>
			<ThemeButton />
			<button class=" button px-3 py-1">Borderless</button>
			<button class=" border_button">With Border</button>
			<button
				class="button"
				disabled>
				Disabled
			</button>
			<button class=" highlight_button">Highlight</button>
			<button class=" warning_button">Warning</button>
		</>
	)
}

function Links() {
	const linkClass = "place-content-center text-center"
	return (
		<>
			<div class="items-center text-center font-bold row-span-12 grid-rows-subgrid grid">
				<div id="link">Link</div>
			</div>

			<a
				class={`link ${linkClass}`}
				href="/114514">
				Normal
			</a>
			<A
				class={`link_gray ${linkClass}`}
				href="/">
				Gray
			</A>
		</>
	)
}
