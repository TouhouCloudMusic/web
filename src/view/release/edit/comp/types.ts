// 共享类型：发行表单的表单仓库类型
import type { FormStore } from "@formisch/solid"

import { NewReleaseCorrection as NewReleaseCorrectionSchema } from "~/domain/release"

export type ReleaseFormStore = FormStore<typeof NewReleaseCorrectionSchema>
