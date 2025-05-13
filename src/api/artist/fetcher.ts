import { FetchClient } from ".."
import type { NewArtistCorrectionOut } from "./schema"

export interface __CreataOption {
	data: NewArtistCorrectionOut
}
export function __create(opt: __CreataOption) {
	return FetchClient.POST("/artist", {
		body: opt.data,
	})
}
