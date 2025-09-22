import type { Tag } from "@thc/api"
import { describe, expect, it } from "vitest"

import { toTagFormInitValue } from "./init"

describe("useTagFormInitialValues", () => {
	it("returns defaults for new tag", () => {
		const result = toTagFormInitValue({ type: "new" })
		expect(result).toEqual({
			type: "Create",
			description: "",
			data: {
				name: "",
				type: "",
				short_description: undefined,
				description: undefined,
				alt_names: [],
				relations: [],
			},
		})
	})

	it("maps existing tag to correction input", () => {
		const tag: Tag = {
			id: 1,
			name: "Tag",
			type: "Genre",
			short_description: "short",
			description: "long",
			alt_names: [{ id: 2, name: "Alt" }],
			relations: [
				{ tag: { id: 3, name: "Tag3", type: "Genre" }, type: "Derive" },
			],
		}
		const result = toTagFormInitValue({ type: "edit", tag })
		expect(result).toEqual({
			type: "Update",
			description: "",
			data: {
				name: "Tag",
				type: "Genre",
				short_description: "short",
				description: "long",
				alt_names: ["Alt"],
				relations: [{ related_tag_id: 3, type: "Derive" }],
			},
		})
	})
})
