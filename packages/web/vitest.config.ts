/// <reference types="vitest" />
import solid from "vite-plugin-solid"
import viteConfigPaths from "vite-tsconfig-paths"
import { defineConfig } from "vitest/config"

export default defineConfig({
	plugins: [solid(), viteConfigPaths()],
	test: {
		browser: {
			provider: "playwright",
			enabled: true,
			name: "chromium",
			headless: true,
		},
		include: ["./test/dom/**/*.{test}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}"],
		includeSource: ["./src/**/*.{ts,tsx}"],
		globalSetup: ["./test/setup_vitest.ts"],
	},
	resolve: {
		conditions: ["development", "browser"],
	},
})
