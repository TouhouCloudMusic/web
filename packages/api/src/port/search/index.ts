import { FetchClient } from "../../http"
import type { Opt } from "../../shared"
import { adaptApiResult } from "../../shared"

export async function search(options: Opt<"search">) {
	const res = await FetchClient.GET("/search", {
		params: options,
	})

	return adaptApiResult(res)
}
