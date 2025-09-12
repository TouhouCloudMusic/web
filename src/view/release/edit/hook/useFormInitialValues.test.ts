// oxlint-disable no-magic-numbers
import type { Release } from "@thc/api"
import { describe, it, expect } from "vitest"

import { useReleaseFormInitialValues } from "./useFormInitialValues"

describe("useReleaseFormInitialValues", () => {
	it("returns correct initial values for new release", () => {
		const result = useReleaseFormInitialValues({ type: "new" })

		expect(result).toEqual({
			type: "Create",
			description: "",
			data: {
				title: "",
				release_type: undefined,
				release_date: undefined,
				recording_date_start: undefined,
				recording_date_end: undefined,
				localized_titles: [],
				artists: [],
				events: [],
				catalog_nums: [],
				credits: [],
				discs: [{ name: "" }],
				tracks: [],
			},
		})
	})

	it("maps edit release to initial values", () => {
		const releaseLike = {
			id: 1,
			title: "Test Release",
			release_type: "Album",
			cover_art_url: "https://example.com/x.jpg",
			release_date: { value: "2020-01-02", precision: "Day" },
			recording_date_start: { value: "2019-05-01", precision: "Month" },
			recording_date_end: { value: "2019-06-01", precision: "Month" },
			artists: [
				{ id: 10, name: "A" },
				{ id: 20, name: "B" },
			],
			localized_titles: [
				{ language: { id: 1, code: "en", name: "English" }, title: "EN" },
				{ language: { id: 2, code: "ja", name: "Japanese" }, title: "JP" },
			],
			catalog_nums: [
				{ catalog_number: "CAT-001", label_id: 1 },
				{ catalog_number: "CAT-002", label_id: undefined },
			],
			discs: [
				{ id: 1, name: "Disc A" },
				{ id: 2, name: undefined },
			],
			tracks: [],
			credits: [
				{
					artist: { id: 10, name: "A" },
					role: { id: 100, name: "Composer" },
					on: [1, 2],
				},
			],
		}

		const result = useReleaseFormInitialValues({
			type: "edit",
			// @ts-expect-error
			release: releaseLike,
		})

		// Dates are converted to Date objects with same precision
		expect(result.data.release_date?.value).toBeInstanceOf(Date)
		expect(result.data.release_date?.precision).toBe("Day")
		expect(result.data.recording_date_start?.value).toBeInstanceOf(Date)
		expect(result.data.recording_date_end?.value).toBeInstanceOf(Date)

		// Localized titles map to language_id + title, preserving length
		expect(result.data.localized_titles).toHaveLength(2)
		expect(result.data.localized_titles[0]?.language_id).toBe(1)
		expect(result.data.localized_titles[1]?.language_id).toBe(2)

		// Artists become ids array
		expect(result.data.artists).toEqual([10, 20])

		// Catalog numbers pass through
		expect(result.data.catalog_nums).toEqual([
			{ catalog_number: "CAT-001", label_id: 1 },
			{ catalog_number: "CAT-002", label_id: undefined },
		])

		// Credits are normalized to ids
		expect(result.data.credits).toEqual([
			{ artist_id: 10, role_id: 100, on: [1, 2] },
		])

		// Discs mapped to name shape
		expect(result.data.discs).toEqual([{ name: "Disc A" }, { name: undefined }])
	})
})
