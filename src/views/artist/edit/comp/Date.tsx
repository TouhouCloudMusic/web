import { useLingui } from "@lingui-solid/solid/macro"
import * as M from "@modular-forms/solid"

import type { NewArtistCorrection } from "~/api/artist/schema"
import { DateWithPrecision } from "~/components/composite/form/DateWithPrecision"

type ArtistFormDateFieldsProps = {
	formStore: M.FormStore<NewArtistCorrection>
}

export function ArtistFormDateFields(props: ArtistFormDateFieldsProps) {
	const { t } = useLingui()

	return (
		<>
			<DateWithPrecision
				label={t`Start date`}
				setValue={(v) => {
					// eslint-disable-next-line @typescript-eslint/no-unsafe-argument
					M.setValue(props.formStore, "data.start_date", v)
				}}
				error={M.getError(props.formStore, "data.start_date", {
					shouldActive: false,
				})}
			/>

			<DateWithPrecision
				label={t`End date`}
				setValue={(v) => {
					// eslint-disable-next-line @typescript-eslint/no-unsafe-argument
					M.setValue(props.formStore, "data.end_date", v)
				}}
				error={M.getError(props.formStore, "data.end_date", {
					shouldActive: false,
				})}
			/>
		</>
	)
}
