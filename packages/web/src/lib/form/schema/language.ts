import { attest } from "@ark/attest"
import { type lang } from "@touhouclouddb/database/interfaces"
import * as v from "valibot"

const langArr: lang.Language[] = ["English", "Chinese", "Japanese", "Romanized"]

export const LocalizedLanguageSchema = v.picklist(langArr, "Invalid language")
export type LocalizedLanguage = v.InferInput<typeof LocalizedLanguageSchema>

if (import.meta.vitest) {
	const { test } = import.meta.vitest
	test("match database type", () => {
		attest<LocalizedLanguage>(langArr[0])
	})
}
