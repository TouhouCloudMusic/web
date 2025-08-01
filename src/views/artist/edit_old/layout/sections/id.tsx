import { useController } from "../context.tsx"

export function ID() {
  const { Field } = useController()
  return (
    <Field name="id">
      {(field, props) => (
        <>
          <input
            {...props}
            type="hidden"
            value={field.value}
            hidden
          />
          {field.error && <p>{field.error}</p>}
        </>
      )}
    </Field>
  )
}
