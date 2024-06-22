// "use server"
import { Params, cache, redirect } from "@solidjs/router"
import e from "db/edgeql-js"
import { int64 } from "db/edgeql-js/modules/std"
import { client } from "~/database/edgedb"
import { validateAndThrowRedirect } from "~/lib/validate/throw_redirect"
import { isEmptyOrValidID } from "~/lib/validate/validate_params"

async function find(id: bigint | number) {
	const idStr = id.toString()
	return await e
		.select(e.default.Artist, (artist) => ({
			...artist["*"],
			alias: {
				...e.default.Artist.alias["*"],
			},
			members: {
				...e.default.Artist.members["*"],
			},
			member_of: {
				...e.default.Artist.member_of["*"],
			},
			filter_single: {
				app_id: int64(idStr),
			},
		}))
		.run(client)
}

export async function getData(id: bigint | number) {
	try {
		return await find(id)
	} catch (error) {
		// TODO: 研究如何把error发到客户端上
		console.log(e)
		throw redirect("/500")
	}
}

export const getArtistDataByID_EditPage = cache(async function (
	params: Params
) {
	const id = validateAndThrowRedirect(isEmptyOrValidID, params)
	if (!id) return
	return await getData(id)
}, `artist_by_id_edit`)
