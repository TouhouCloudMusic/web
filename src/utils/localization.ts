import type { LocalizedTitle } from "@thc/api"

/**
 * Get the preferred localized title from an array of localized titles.
 * Currently defaults to English if available, otherwise returns the first available title.
 * 
 * @param localizedTitles - Array of localized titles
 * @param preferredLanguages - Array of preferred language codes in order of preference
 * @returns The preferred localized title or null if none available
 */
export function getPreferredLocalizedTitle(
	localizedTitles: LocalizedTitle[] | undefined,
	preferredLanguages: string[] = ["en"]
): LocalizedTitle | null {
	if (!localizedTitles || localizedTitles.length === 0) {
		return null
	}

	// Try to find title in order of preference
	for (const languageCode of preferredLanguages) {
		const found = localizedTitles.find(
			(title) => title.language.code === languageCode
		)
		if (found) {
			return found
		}
	}

	// If no preferred language found, return the first available
	return localizedTitles[0] || null
}