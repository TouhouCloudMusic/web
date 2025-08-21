set dotenv-load

gen:
  rm -rf ./src/gen/index.ts
  pnpx openapi-typescript $API_SCHEMA -o ./src/gen/index.ts \
  --alphabetize \
  --array-length \
  --make-paths-enum \
  --export-type \
  --root-types \
  --root-types-no-schema-prefix
