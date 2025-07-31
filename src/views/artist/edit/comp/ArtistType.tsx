import { Trans } from "@lingui-solid/solid/macro"
import * as M from "@modular-forms/solid"
import { For } from "solid-js"

import type { ArtistType, NewArtistCorrection } from "~/api/artist/schema"
import { FormComp } from "~/components/common/form"

type ArtistFormArtistTypeFieldProps = {
	formStore: M.FormStore<NewArtistCorrection>
}

export function ArtistFormArtistTypeField(
	props: ArtistFormArtistTypeFieldProps,
) {
	return (
		<M.Field
			name="data.artist_type"
			type="string"
			of={props.formStore}
		>
			{(field, fieldProps) => (
				<div class="flex flex-col">
					<FormComp.Label for="artist_type">
						<Trans>Artist Type</Trans>
					</FormComp.Label>
					<div class="w-fit rounded-sm border border-slate-300">
						<select
							{...fieldProps}
							id="artist_type"
							class="h-8 w-fit px-1 whitespace-nowrap"
						>
							<option value="">
								<Trans>-- Please select artist type --</Trans>
							</option>
							<For each={["Solo", "Multiple", "Unknown"] as ArtistType[]}>
								{(type) => (
									<option
										value={type}
										selected={field.value == type}
									>
										{type}
									</option>
								)}
							</For>
						</select>
					</div>
					<FormComp.ErrorMessage message={field.error} />
				</div>
			)}
		</M.Field>
	)
}
