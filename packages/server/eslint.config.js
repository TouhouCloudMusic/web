import pluginJs from "@eslint/js"
import prettier from "eslint-config-prettier"
import oxlint from "eslint-plugin-oxlint"
import globals from "globals"
import tseslint from "typescript-eslint"
export default tseslint.config(
  pluginJs.configs.recommended,
  prettier,
  ...tseslint.configs.strictTypeChecked,
  ...tseslint.configs.stylisticTypeChecked,
  oxlint.configs["flat/recommended"],
  oxlint.configs["flat/typescript"],
  oxlint.configs["flat/unicorn"],
  oxlint.configs["flat/import"],
  oxlint.configs["flat/jsdoc"],
  {
    languageOptions: {
      globals: globals.node,
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
  },
)
