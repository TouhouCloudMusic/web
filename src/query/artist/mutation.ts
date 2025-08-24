import { useMutation } from "@tanstack/solid-query"
import { ArtistApi } from "@thc/api"

import type { NewArtistCorrection } from "./schema"

export const getInstance = () =>
	useMutation(() => ({
		mutationFn: (
			params:
				| { type: "Create"; data: NewArtistCorrection }
				| { type: "Update"; id: number; data: NewArtistCorrection },
		) => {
			if (params.type === "Create")
				return ArtistApi.create({
					body: params.data,
				})
			else {
				return ArtistApi.upsertCorrection({
					path: { id: params.id },
					body: params.data,
				})
			}
		},

		mutationKey: [`artist::mutate`],
		throwOnError: false,
	}))
