import type { Language, LanguageListError } from "~/gen"
import { languageList } from "~/gen"
import type { ApiResult } from "~/shared"
import { apiResultFrom } from "~/shared"

type Opt = Parameters<typeof languageList>

export async function findAll(
	...option: Opt
): Promise<ApiResult<Language[], LanguageListError>> {
	return apiResultFrom(await languageList(...option))
}
