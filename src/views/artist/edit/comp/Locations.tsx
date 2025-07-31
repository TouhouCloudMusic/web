import { useLingui } from "@lingui-solid/solid/macro"
import * as M from "@modular-forms/solid"

import type { NewArtistCorrection } from "~/api/artist/schema"
import { Location } from "~/components/composite/form/Location"

type ArtistFormLocationFieldsProps = {
	formStore: M.FormStore<NewArtistCorrection>
}

export function ArtistFormLocationFields(props: ArtistFormLocationFieldsProps) {
	const { t } = useLingui()

	return (
		<>
			<Location
				label={t`Start Location`}
				setValue={(v) => {
					M.setValue(props.formStore, "data.start_location", v)
				}}
			/>
			<Location
				label={t`Current Location`}
				setValue={(v) => {
					M.setValue(props.formStore, "data.current_location", v)
				}}
			/>
		</>
	)
}
