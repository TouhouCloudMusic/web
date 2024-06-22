export function hexToHSL(hex: string) {
	const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
	if (!result) throw new Error("Invalid hex color: " + hex)
	const r = parseInt(result[1], 16) / 255
	const g = parseInt(result[2], 16) / 255
	const b = parseInt(result[3], 16) / 255

	const max = Math.max(r, g, b),
		min = Math.min(r, g, b)
	let h = 0
	let s = 0
	const l = (max + min) / 2
	if (max !== min) {
		const d = max - min
		s = l > 0.5 ? d / (2 - max - min) : d / (max + min)
		switch (max) {
			case r:
				h = (g - b) / d + (g < b ? 6 : 0)
				break
			case g:
				h = (b - r) / d + 2
				break
			case b:
				h = (r - g) / d + 4
				break
		}
		h /= 6
	}
	return [Math.round(h * 360), Math.round(s * 100), Math.round(l * 100)]
}

const res = hexToHSL("#ff0000")
console.log(res)

type color = Record<number, string>

type colors = Record<string, color>

const opencolors: colors = {
	gray: {
		50: "#1A1A1A",
		100: "#1F1F1F",
		200: "#292929",
		300: "#2E2E2E",
		400: "#454545",
		500: "#878787",
		600: "#8F8F8F",
		700: "#7D7D7D",
		800: "#A1A1A1",
		900: "#EDEDED",
	},
	red: {
		50: "#2A1314",
		100: "#3C1618",
		200: "#561A1E",
		300: "#671E21",
		400: "#832126",
		500: "#E5484D",
		600: "#E5484D",
		700: "#D93036",
		800: "#FF6166",
		900: "#FEECEE",
	},
	orange: {
		50: "#291800",
		100: "#331B00",
		200: "#4D2A00",
		300: "#573300",
		400: "#6B4105",
		500: "#E79D13",
		600: "#FFB224",
		700: "#FF990A",
		800: "#FF990A",
		900: "#FEF3DC",
	},
	green: {
		50: "#0B2212",
		100: "#0F2E18",
		200: "#12361B",
		300: "#0C451B",
		400: "#126426",
		500: "#1A9338",
		600: "#45A557",
		700: "#398E4A",
		800: "#62C073",
		900: "#E5FBEA",
	},
	cyan: {
		50: "#04201B",
		100: "#062822",
		200: "#083A33",
		300: "#053D35",
		400: "#085E53",
		500: "#0C9784",
		600: "#12A594",
		700: "#0D8C7D",
		800: "#0AC7B4",
		900: "#E0FAF4",
	},
	blue: {
		50: "#0F1C2E",
		100: "#10233D",
		200: "#0F2F57",
		300: "#0D3868",
		400: "#0A4380",
		500: "#0091FF",
		600: "#0072F5",
		700: "#0062D1",
		800: "#52A8FF",
		900: "#EBF6FF",
	},
	purple: {
		50: "#231528",
		100: "#2E1938",
		200: "#422154",
		300: "#4F2768",
		400: "#5F2E85",
		500: "#8E4EC6",
		600: "#8E4EC6",
		700: "#763DA9",
		800: "#BF7AF0",
		900: "#F8EDFC",
	},
	pink: {
		50: "#28151D",
		100: "#3A1726",
		200: "#4F1C31",
		300: "#551B33",
		400: "#6C1E3E",
		500: "#B31A57",
		600: "#EA3E83",
		700: "#DF2670",
		800: "#F75F8F",
		900: "#FEECF4",
	},
}

function generator(colors: colors) {
	let outputStr = ""

	for (const key of Object.keys(colors)) {
		const color = colors[key]
		const colorName = key
		for (const colorKey of Object.keys(color)) {
			const number =
				parseFloat(colorKey) === 50 ? 100 : parseFloat(colorKey) + 100

			const HSL = hexToHSL(color[parseFloat(colorKey)])
			const HSLStr = `${HSL[0]} ${HSL[1]}% ${HSL[2]}%`
			outputStr += `--${colorName}-${number}: ${HSLStr};`
		}
	}

	return outputStr
}

const output = generator(opencolors)
output
