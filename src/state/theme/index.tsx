import type { ParentProps, Signal } from "solid-js"
import { createContext, createSignal, Suspense } from "solid-js"

import { assertContext, useContextUnsave } from "~/utils/context"

export enum AppTheme {
	Light,
	Dark,
}

export class ThemeStore {
	private signal: Signal<AppTheme>

	constructor(theme: AppTheme) {
		this.signal = createSignal(theme)
	}

	public get theme(): AppTheme {
		return this.signal[0]()
	}

	public static new(theme: AppTheme) {
		return new ThemeStore(theme)
	}

	public static default() {
		return new ThemeStore(AppTheme.Light)
	}

	public set(theme: AppTheme): void {
		this.signal[1](theme)

		switch (theme) {
			case AppTheme.Dark: {
				this.setDocumentTheme()
				break
			}
			default: {
				this.setDocumentTheme()
			}
		}
	}

	setDocumentTheme() {
		setDocumentTheme(this.theme)
	}
}

export const ThemeContext = createContext<ThemeStore>()
export const useTheme = () => assertContext(ThemeContext)

export function ThemeProvider(props: ParentProps) {
	return (
		<Suspense>
			<ThemeContext.Provider value={ThemeStore.default()}>
				{props.children}
			</ThemeContext.Provider>
		</Suspense>
	)
}

function fromString(str: string) {
	// eslint-disable-next-line @typescript-eslint/no-unsafe-enum-comparison
	if (AppTheme.Dark == Number.parseInt(str)) {
		return AppTheme.Dark
	}
	return AppTheme.Light
}

function toString(theme: AppTheme) {
	switch (theme) {
		case AppTheme.Dark: {
			return "dark"
		}
		default: {
			return "light"
		}
	}
}

// function setThemeCookie(theme: AppTheme) {
//   Cookie.set("app_theme", String(theme), {
//     expires: dayjs().add(30, "days").toDate(),
//   })
// }

function setDocumentTheme(theme: AppTheme) {
	document.querySelector("#app")!.classList.add("notransition")
	document.documentElement.setAttribute("data-mode", toString(theme))
	setTimeout(() => {
		document.querySelector("#app")!.classList.remove("notransition")
	}, 0)
}
