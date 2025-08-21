import type { UserProfile, ProfileError, ProfileWithNameError } from "~/gen"
import { profile, profileWithName } from "~/gen"
import type { ApiResult } from "~/shared"
import { apiResultFrom } from "~/shared"

type OptProfile = Parameters<typeof profile>
type OptProfileWithName = Parameters<typeof profileWithName>

export async function current(
	...option: OptProfile
): Promise<ApiResult<UserProfile, ProfileError>> {
	return apiResultFrom(await profile(...option))
}

export async function findByName(
	...option: OptProfileWithName
): Promise<ApiResult<UserProfile, ProfileWithNameError>> {
	return apiResultFrom(await profileWithName(...option))
}
