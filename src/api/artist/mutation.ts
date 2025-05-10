import { useMutation } from "@tanstack/solid-query"

import { type NewArtistCorrection } from "."
import * as Fetcher from "./fetcher"

export const create = useMutation(() => ({
	mutationFn: async (data: NewArtistCorrection) => {
		return Fetcher.__create({
			data,
		})
	},
	mutationKey: ["artist::create"],
}))
