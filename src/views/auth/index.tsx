import { Guard, FormComp } from "./component"

export function Auth() {
	return (
		<Guard>
			<FormComp />
		</Guard>
	)
}