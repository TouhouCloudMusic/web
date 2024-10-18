export const RELEASE_TYPE = {
  Album: { id: 1, name: "Album" },
  EP: { id: 2, name: "EP" },
  Single: { id: 3, name: "Single" },
} as const

export const RELEASE_TYPE_ARRAY = ["Album", "EP", "Single"] as const
