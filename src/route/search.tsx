import { createFileRoute } from "@tanstack/solid-router"
import { type } from "arktype"

import { SearchView } from "~/view/search"

const SearchSchema = type({
	keyword: "string",
})

export const Route = createFileRoute("/search")({
	component: SearchView,
	validateSearch: SearchSchema,
})
