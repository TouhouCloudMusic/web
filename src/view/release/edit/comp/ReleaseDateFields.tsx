// 发行/录音日期字段
import { getErrors, setInput } from "@formisch/solid"
import { useLingui } from "@lingui-solid/solid/macro"

import { DateWithPrecision } from "~/component/form/DateWithPrecision"

import type { ReleaseFormStore } from "./types"

export function ReleaseDateFields(props: { of: ReleaseFormStore }) {
	const { t } = useLingui()
	return (
		<>
            <DateWithPrecision
                label={t`Release date`}
                setValue={(v) =>
                    setInput(props.of, {
                        path: ["data", "release_date"],
                        input: (v ?? ({} as unknown as never)),
                    })
                }
				error={
					getErrors(props.of, {
						path: ["data", "release_date"],
					})?.[0]
				}
			/>

            <DateWithPrecision
                label={t`Recording start`}
                setValue={(v) =>
                    setInput(props.of, {
                        path: ["data", "recording_date_start"],
                        input: (v ?? ({} as unknown as never)),
                    })
                }
				error={
					getErrors(props.of, {
						path: ["data", "recording_date_start"],
					})?.[0]
				}
			/>

            <DateWithPrecision
                label={t`Recording end`}
                setValue={(v) =>
                    setInput(props.of, {
                        path: ["data", "recording_date_end"],
                        input: (v ?? ({} as unknown as never)),
                    })
                }
				error={
					getErrors(props.of, {
						path: ["data", "recording_date_end"],
					})?.[0]
				}
			/>
		</>
	)
}
