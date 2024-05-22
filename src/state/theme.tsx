import { AppTheme } from "./app.state"

export function readLocalTheme() {
	const localTheme = localStorage.getItem("app_theme")
	if (!localTheme) return
	if (!Object.values(AppTheme).includes(parseInt(localTheme, 10))) return
	else return parseInt(localTheme, 10)
}

export function storageTheme(theme: AppTheme) {
	localStorage.setItem("app_theme", theme.toString())
}

export function updateTheme(theme: AppTheme) {
	function change(str: string) {
		document.getElementById("app")!.classList.add("notransition")
		document.documentElement.setAttribute("data-mode", str)
		setTimeout(() => {
			document.getElementById("app")!.classList.remove("notransition")
		}, 0)
	}
	switch (theme) {
		case AppTheme.dark:
			change("dark")
			break
		default:
			change("light")
	}
}
