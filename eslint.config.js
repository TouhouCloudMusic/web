// @ts-check
import eslint from "@eslint/js"
import eslintConfigPrettier from "eslint-config-prettier"
// @ts-ingnore
import jsxA11y from "eslint-plugin-jsx-a11y"
import solid from "eslint-plugin-solid"
import globals from "globals"
import tslint from "typescript-eslint"
export default [
	{
		ignores: [".cz-config.cjs", ".output/**", ".vinxi/**"],
		languageOptions: {
			globals: { ...globals.browser, ...globals.node },
			parserOptions: {
				project: ["./tsconfig.json", "./packages/*/tsconfig.json"],
			},
		},
	},
	eslint.configs.recommended,
	...tslint.configs.strictTypeChecked,
	...tslint.configs.stylisticTypeChecked,

	eslintConfigPrettier,
	// base
	{
		rules: {
			"@typescript-eslint/array-type": "off",
			"@typescript-eslint/ban-ts-comment": "off",
			"@typescript-eslint/consistent-type-definitions": "off",
			"@typescript-eslint/no-confusing-void-expression": "off",
			"@typescript-eslint/no-empty-interface": "off",
			"@typescript-eslint/no-misused-promises": [
				"error",
				{
					checksVoidReturn: {
						attributes: false,
					},
				},
			],
			"@typescript-eslint/no-non-null-assertion": "off",
			"@typescript-eslint/no-unused-vars": "warn",
			"@typescript-eslint/only-throw-error": "off",
			"@typescript-eslint/restrict-template-expressions": [
				"error",
				{ allowNumber: true },
			],
		},
	},
	// jsx
	{
		// eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
		...jsxA11y.flatConfigs.recommended,
		...solid.configs["flat/typescript"],
		files: ["./packages/web/src/**/*.{jsx,tsx}"],
		rules: {
			"solid/self-closing-comp": [
				"warn",
				{
					// which Solid components should be self-closing when possible
					component: "all", // "all" | "none"
					// which native elements should be self-closing when possible
					html: "void", // "all" | "void" | "none"
				},
			],
			"solid/prefer-for": "off",
			"solid/components-return-once": ["error"],
			/**
			 * 暂不支持solid jsx
			 * https://github.com/jsx-eslint/eslint-plugin-jsx-a11y/issues/894
			 * https://github.com/jsx-eslint/eslint-plugin-jsx-a11y/pull/977
			 * */
			"jsx-a11y/label-has-associated-control": "off",
		},
	},
]
