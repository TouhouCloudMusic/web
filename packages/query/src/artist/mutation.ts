import { useMutation } from "@tanstack/solid-query"
import type { NewCorrectionNewArtist } from "@thc/api"
import { ArtistApi } from "@thc/api"

type Parmas =
	| { type: "Create"; data: NewCorrectionNewArtist }
	| { type: "Update"; id: number; data: NewCorrectionNewArtist }
export const getInstance = () =>
	useMutation(() => ({
		mutationFn: (params: Parmas) => {
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
