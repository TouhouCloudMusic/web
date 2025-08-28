// oxlint-disable max-lines-per-function
import { For } from "solid-js"
import type { Meta, StoryObj } from "storybook-solidjs"

type Color = {
	name: string
	colors: string[]
}

let colors: Color[] = [
	{
		name: "Slate",
		colors: [
			"#f3f4f5",
			"#e8eaed",
			"#d5d7db",
			"#b8bbc0",
			"#999fa7",
			"#7a7d85",
			"#595e65",
			"#3a3d44",
			"#1b1e25",
		],
	},
	{
		name: "Reimu",
		colors: [
			"#fff0ef",
			"#ffe4e1",
			"#ffcac6",
			"#ff9e99",
			"#f87572",
			"#db464c",
			"#a82f33",
			"#6f1c1e",
			"#370600",
		],
	},
	{
		name: "Blue",
		colors: [
			"#edf4ff",
			"#deeaff",
			"#c4d9fd",
			"#96baff",
			"#719cfb",
			"#4e76e2",
			"#2755c7",
			"#06328c",
			"#011446",
		],
	},
	{
		name: "Marisa",
		colors: [
			"#fbf3d1",
			"#f7eab8",
			"#efd598",
			"#d8b669",
			"#c39744",
			"#9f7704",
			"#81560a",
			"#543605",
			"#261903",
		],
	},
	{
		name: "Green",
		colors: [
			"#dcfce6",
			"#c0f6d2",
			"#92eaad",
			"#62cf7d",
			"#2fb459",
			"#00903a",
			"#006b28",
			"#004616",
			"#002200",
		],
	},
]

let cssOverride = colors
	.flatMap((color) =>
		color.colors.map((hex, index) => ({
			[`--color-${color.name.toLowerCase()}-${(index + 1) * 100}`]: hex,
		})),
	)
	.reduce((a, b) => Object.assign(a, b))

function Palette() {
	return (
		<div
			// style={cssOverride}
			class="flex flex-col gap-8"
		>
			<div class="grid w-fit grid-cols-[1fr_auto]">
				<For each={colors}>
					{(color) => (
						<>
							<div class="mr-2 flex">{color.name}</div>
							<ul class="flex">
								<For each={color.colors}>
									{(hex) => (
										<li
											class="m-1 size-10 rounded"
											style={{
												"background-color": hex,
											}}
										></li>
									)}
								</For>
							</ul>
						</>
					)}
				</For>
			</div>
			<div class="flex flex-col">
				<h1 class="mb-1 text-xl text-slate-900">Text comparison</h1>
				<div class="flex flex-col">
					<For
						each={colors.find((c) => c.name === "Slate")?.colors.toReversed()}
					>
						{(color) => <span style={{ color }}>Text is {color}</span>}
					</For>
				</div>
				<div class="bg-slate-1100 flex flex-col">
					<For each={colors.find((c) => c.name === "Slate")?.colors}>
						{(color) => <span style={{ color }}>Text is {color}</span>}
					</For>
				</div>
			</div>

			<div class="p2 space-y-4">
				<h1 class="mb-1 text-xl text-slate-900">Border</h1>
				<div class="grid w-fit grid-cols-7 gap-2 *:border-[1.5px]">
					<div class="border-slate-50 size-8 rounded border"></div>
					<div class="size-8 rounded border border-slate-100"></div>
					<div class="size-8 rounded border border-slate-200"></div>
					<div class="size-8 rounded border border-slate-300"></div>
					<div class="size-8 rounded border border-slate-400"></div>
					<div class="size-8 rounded border border-slate-500"></div>
					<div class="size-8 rounded border border-slate-600"></div>
					<div class="border-slate-50 bg-slate-50 size-8 rounded border"></div>
					<div class="bg-slate-50 size-8 rounded border border-slate-100"></div>
					<div class="bg-slate-50 size-8 rounded border border-slate-200"></div>
					<div class="bg-slate-50 size-8 rounded border border-slate-300"></div>
					<div class="bg-slate-50 size-8 rounded border border-slate-400"></div>
					<div class="bg-slate-50 size-8 rounded border border-slate-500"></div>
					<div class="bg-slate-50 size-8 rounded border border-slate-600"></div>
					<div class="border-slate-50 size-8 rounded border bg-slate-100"></div>
					<div class="size-8 rounded border border-slate-100 bg-slate-100"></div>
					<div class="size-8 rounded border border-slate-200 bg-slate-100"></div>
					<div class="size-8 rounded border border-slate-300 bg-slate-100"></div>
					<div class="size-8 rounded border border-slate-400 bg-slate-100"></div>
					<div class="size-8 rounded border border-slate-500 bg-slate-100"></div>
					<div class="size-8 rounded border border-slate-600 bg-slate-100"></div>
					<div class="border-slate-50 size-8 rounded border bg-slate-200"></div>
					<div class="size-8 rounded border border-slate-100 bg-slate-200"></div>
					<div class="size-8 rounded border border-slate-200 bg-slate-200"></div>
					<div class="size-8 rounded border border-slate-300 bg-slate-200"></div>
					<div class="size-8 rounded border border-slate-400 bg-slate-200"></div>
					<div class="size-8 rounded border border-slate-500 bg-slate-200"></div>
					<div class="size-8 rounded border border-slate-600 bg-slate-200"></div>
				</div>
			</div>

			<div class="grid grid-cols-2 gap-2">
				<For each={colors}>
					{(palette) => {
						const colorStack = palette.colors.slice(0, 5)
						const nested = colorStack.reduce(
							(child, color, idx) => {
								const size = `${(16 + idx * 8) * 4}px`
								return (
									<div
										class="m-auto flex place-content-center rounded-full"
										style={{
											width: size,
											height: size,
											"background-color": color,
										}}
									>
										{child}
									</div>
								)
							},
							<div
								class="m-auto rounded-full bg-white"
								style={{ width: "32px", height: "32px" }}
							></div>,
						)
						return <>{nested}</>
					}}
				</For>
			</div>
		</div>
	)
}

const meta = {
	title: "Palette",
	component: Palette,
} satisfies Meta<typeof Palette>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}
