import { AppTheme } from "~/state/app.state"
import { ThemeVars } from "./themeVars"
import { lightThemeVars } from "./light"
import { darkThemeVars } from "./dark"

export function updateThemeVars(theme: AppTheme) {
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	function updateVars(vars: ThemeVars) {
		for (const key of Object.keys(vars)) {
			document.documentElement.style.setProperty(key, vars[key])
		}
	}
	switch (theme) {
		case AppTheme.light:
			updateVars(lightThemeVars)
			break
		case AppTheme.dark:
			updateVars(darkThemeVars)
			break
		default:
			throw new Error("Invalid theme value")
	}
}
