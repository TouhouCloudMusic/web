// @refresh reload
import { createHandler, StartServer } from "@solidjs/start/server"
import { AppTheme } from "./state/app.state"
import { getCookie } from "vinxi/http"
export default createHandler(() => (
	<StartServer
		document={({ assets, children, scripts }) => (
			<html lang="en" data-mode={getCookie("app_theme") === AppTheme.dark.toString() ? "dark" : "light"}>
				<head>
					<meta charset="utf-8" />
					<meta
						name="viewport"
						content="width=device-width, initial-scale=1"
					/>
					<link
						rel="icon"
						href="/logo.svg"
					/>
					{assets}
				</head>
				<body>
					<div id="app" class="notransition">{children}</div>
					{scripts}
				</body>
			</html>
		)}
	/>
))
