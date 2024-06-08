/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import pluginJs from "@eslint/js"
import eslintConfigPrettier from "eslint-config-prettier"
import a11y from "eslint-plugin-jsx-a11y"
import solid from "eslint-plugin-solid/configs/typescript.js"
import globals from "globals"
import tseslint from "typescript-eslint"
export default [
	{
		languageOptions: {
			globals: { ...globals.browser, ...globals.node },
			parserOptions: { project: true },
		},
		plugins: {
			"jsx-a11y": a11y,
		},
		rules: a11y.configs.strict.rules,
	},
	pluginJs.configs.recommended,
	...tseslint.configs.recommendedTypeChecked,
	...tseslint.configs.stylisticTypeChecked,

	solid,
	eslintConfigPrettier,
	{
		rules: {
			"@typescript-eslint/no-unused-vars": "warn",
			"@typescript-eslint/array-type": "off",
			"@typescript-eslint/consistent-type-definitions": "off",
			"@typescript-eslint/no-empty-interface": "off",
			"@typescript-eslint/no-misused-promises": [
				"error",
				{
					checksVoidReturn: {
						// arguments: false,
						attributes: false,
					},
				},
			],
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
			"jsx-a11y/label-has-associated-control": "off",
		},
	},
	{
		ignores: [".cz-config.cjs", ".output/", ".vinxi/"],
	},
]
