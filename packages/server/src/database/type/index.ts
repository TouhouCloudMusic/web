import { localization_language } from "~/database/schema"

export * from "../schema"
export * from "./typebox"

export type LocalizationLanguage =
  (typeof localization_language.enumValues)[number]
