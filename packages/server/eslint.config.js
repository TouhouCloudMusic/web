import pluginJs from "@eslint/js"
import prettier from "eslint-config-prettier"
import exportScope from "eslint-plugin-export-scope"
import oxlint from "eslint-plugin-oxlint"
import globals from "globals"
import tseslint from "typescript-eslint"

export default tseslint.config(
  pluginJs.configs.recommended,
  prettier,
  exportScope.configs.flatConfigRecommended,
  ...tseslint.configs.strictTypeChecked,
  ...tseslint.configs.stylisticTypeChecked,
  oxlint,
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
