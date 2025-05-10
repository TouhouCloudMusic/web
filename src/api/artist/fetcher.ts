import { FetchClient } from ".."
import { type NewArtistCorrection } from "./schema"

export type __CreataOption = {
	data: NewArtistCorrection
}
export function __create(opt: __CreataOption) {
	return FetchClient.POST("/artist", {
		body: opt.data,
	})
}
