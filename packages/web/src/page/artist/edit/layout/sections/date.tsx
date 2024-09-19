import { getValue, setValue } from "@modular-forms/solid"
import { ArkErrors, type } from "arktype"
import dayjs from "dayjs"
import { list } from "radash"
import {
	createEffect,
	createSignal,
	For,
	Index,
	JSX,
	Setter,
	Show,
} from "solid-js"
import { CURRENT_YEAR } from "~/lib/global_constant.ts"
import { useController } from "../context.tsx"

export function DateField() {
	const { artistType, formStore, Field } = useController()

	const startDateLabel = () =>
		artistType.isGroup ? "Formed Date" : "Birth Date"
	const startDateFieldName = () =>
		artistType.isGroup ? "formed_date" : "birth_date"

	const endDateLabel = () =>
		artistType.isGroup ? "Disbanded Date" : "Death Date"

	const endDateFieldName = () =>
		artistType.isGroup ? "disbanded_date" : "death_date"

	return (
		<section>
			<h2>
				<Show
					when={artistType.isNone}
					fallback={
						<>
							{startDateLabel()} / {endDateLabel()}
						</>
					}>
					Please Select Artist Type
				</Show>
			</h2>
			<For
				each={
					[
						{
							label: startDateLabel,
							name: startDateFieldName,
							fieldName: "date_of_start",
						},
						{
							label: endDateLabel,
							name: endDateFieldName,
							fieldName: "date_of_end",
						},
					] as const
				}>
				{(fieldSet) => {
					const [year, setYear] = createSignal<number>()
					const [month, setMonth] = createSignal<number>()
					const [day, setDay] = createSignal<number>()

					const [dayList, setDayList] = createSignal<number[]>([])

					createEffect(() => {
						if (year() && month()) {
							setDayList(list(1, dayjs(`${year()}-${month()}`).daysInMonth()))
						}
						if (year()) {
							setValue(
								formStore,
								fieldSet.fieldName,
								new Date(year()!, month() ? month()! - 1 : 0, day() ?? 0)
							)
						}
					})

					const parseInput =
						(
							setFn: Setter<number | undefined>
						): JSX.ChangeEventHandlerUnion<
							HTMLInputElement | HTMLSelectElement,
							Event
						> =>
						(e) => {
							const parseResult = type.number(Number(e.target.value))
							if (parseResult instanceof ArkErrors) return setFn()
							else setFn(parseResult)
						}

					return (
						<fieldset
							name={fieldSet.name()}
							class="grid grid-cols-3 [&_label]:row-start-1">
							<legend>{fieldSet.label()}</legend>
							<Field
								name={fieldSet.fieldName}
								type="Date">
								{(field, props) => {
									const value = () =>
										field.value ? dayjs(field.value).format("YYYY-MM-DD") : ""
									return (
										<input
											{...props}
											type="date"
											hidden
											value={value()}
										/>
									)
								}}
							</Field>
							<label for={`${fieldSet.name()}_year`}>Year</label>
							<select
								name={`${fieldSet.name()}_year`}
								onChange={parseInput(setYear)}>
								<option></option>
								<Index each={list(1900, CURRENT_YEAR).reverse()}>
									{(year) => <option value={year()}>{year()}</option>}
								</Index>
							</select>

							<label>Month</label>
							<select
								name={`${fieldSet.name()}_month`}
								onChange={parseInput(setMonth)}>
								<option value={0}></option>
								<Index each={list(1, 12)}>
									{(month) => <option value={month()}>{month()}</option>}
								</Index>
							</select>

							<label for={`${fieldSet.name()}_day`}>Day</label>
							<select
								value={day()}
								onChange={parseInput(setDay)}
								name={`${fieldSet.name()}_day`}
								disabled={dayList().length === 0}>
								<option></option>
								<Index each={dayList()}>
									{(day) => <option value={day()}>{day()}</option>}
								</Index>
							</select>
						</fieldset>
					)
				}}
			</For>
		</section>
	)
}
