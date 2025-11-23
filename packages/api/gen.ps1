Remove-Item -Path ./src/gen.ts -Force -ErrorAction SilentlyContinue
pnpm exec openapi-typescript ./openapi.json -o ./src/gen.ts --alphabetize --array-length --make-paths-enum --export-type --root-types --root-types-no-schema-prefix
