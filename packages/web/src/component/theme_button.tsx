import { type ComponentProps, createMemo, Match, Switch } from "solid-js"
import { MoonIcon, SunIcon } from "solid-radix-icons"
import { twMerge } from "tailwind-merge"
import { AppTheme, useTheme } from "~/state/theme"
import { Button } from "./button"

const defaultStyle = `flex place-content-center items-center`

export function ThemeButton(
	props: Omit<ComponentProps<"button">, "onClick" | "children">
) {
	const theme = useTheme()

	const twClass = createMemo(() => twMerge(defaultStyle, props.class))

	return (
		<Switch>
			<Match when={theme.value() === AppTheme.light}>
				<Button.Borderless
					{...props}
					class={twClass()}
					onClick={() => theme.set(AppTheme.dark)}>
					<SunIcon />
				</Button.Borderless>
			</Match>
			<Match when={theme.value() === AppTheme.dark}>
				<Button.Borderless
					{...props}
					class={twClass()}
					onClick={() => theme.set(AppTheme.light)}>
					<MoonIcon />
				</Button.Borderless>
			</Match>
		</Switch>
	)
}
