import { Asterisk } from "~/components/form/Asterisk.tsx"
import { ErrorMessage, Label } from "~/components/form/base.tsx"
import { RadioGroup } from "~/components/form/index.tsx"

import { useController } from "../context.tsx"

export function ArtistType() {
  const { t, Field } = useController()
  return (
    <fieldset>
      <legend
        class={`${Label.className} ${Asterisk.className} after:content-['_*']`}
      >
        {t.artist_type()}
      </legend>
      <div class={RadioGroup.Container.className}>
        <Field name="artist_type">
          {(field, props) => (
            <>
              <div class={RadioGroup.Item.className}>
                <input
                  {...props}
                  required
                  type="radio"
                  value="Person"
                  data-slot="input"
                  id="artist_type_person"
                  class={RadioGroup.Item.Input.className}
                  checked={field.value === "Person"}
                />
                <RadioGroup.ItemLabel for="artist_type_person">
                  {t.person()}
                </RadioGroup.ItemLabel>
              </div>
              <div class={RadioGroup.Item.className}>
                <input
                  {...props}
                  required
                  type="radio"
                  value="Group"
                  data-slot="input"
                  id="artist_type_group"
                  class={RadioGroup.Item.Input.className}
                  checked={field.value === "Group"}
                />
                <RadioGroup.ItemLabel for="artist_type_group">
                  {t.group()}
                </RadioGroup.ItemLabel>
              </div>
              <ErrorMessage class="mt-4 block">{field.error}</ErrorMessage>
            </>
          )}
        </Field>
      </div>
    </fieldset>
  )
}
