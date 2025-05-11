import { FetchClient } from ".."
import { type __NewArtistCorrectionOut } from "./schema"

export type __CreataOption = {
	data: __NewArtistCorrectionOut
}
export function __create(opt: __CreataOption) {
	return FetchClient.POST("/artist", {
		body: opt.data,
	})
}
