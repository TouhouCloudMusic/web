import { useMutation } from "@tanstack/solid-query"

import * as Fetcher from "./fetcher"
import { type __NewArtistCorrectionOut } from "./schema"

export const create = useMutation(() => ({
	mutationFn: async (data: __NewArtistCorrectionOut) => {
		return Fetcher.__create({
			data,
		})
	},
	mutationKey: ["artist::create"],
}))
