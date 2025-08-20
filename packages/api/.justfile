set dotenv-load

gen:
  pnpx @hey-api/openapi-ts -i $SERVER_URL/openapi.json -o src/gen
