import * as M from "@modular-forms/solid"
import { createForm } from "@modular-forms/solid"
import { For } from "solid-js"
import { NewArtistCorrection, type ArtistType } from "~/api/artist/schema"
import { PageLayout } from "~/layout/PageLayout"

export default function () {
	return (
		<PageLayout class="grid grid-cols-24">
			<Form />
		</PageLayout>
	)
}

function Form() {
	const [formStore, { Form, Field, FieldArray }] =
		createForm<NewArtistCorrection>({
			validate: M.valiForm(NewArtistCorrection),
		})

	const handleSubmit = (values: NewArtistCorrection) => {
		console.log(values)
		// 这里可以添加表单提交逻辑
	}

	function Location(props: { name: "start_date" | "end_date" }) {
		return (
			<>
				<Field name={`data.${props.name}.value`}>
					{(field, props) => (
						<input
							{...props}
							type="date"
							id={`${props.name}.value`}
							value={field.value}
						/>
					)}
				</Field>
				<Field name={`data.${props.name}.precision`}>
					{(_field, props) => (
						<select
							id={`${props.name}.prec`}
							{...props}
						>
							<option value="">--Please choose an option--</option>
							<For each={["Year", "Month", "Day"] as const}>
								{(precision) => <option value={precision}>{precision}</option>}
							</For>
						</select>
					)}
				</Field>
			</>
		)
	}

	return (
		<Form
			onSubmit={handleSubmit}
			class="col-span-22 col-start-2"
		>
			<Field name="data.name">
				{(field, props) => (
					<div>
						<label for="name">Name:</label>
						<input
							{...props}
							type="text"
							id="name"
							value={field.value}
						/>
						{field.error && <span>{field.error}</span>}
					</div>
				)}
			</Field>

			<Field name="data.artist_type">
				{(field, props) => (
					<div>
						<label for="artist_type">Artist Type:</label>
						<select
							{...props}
							id="artist_type"
							value={field.value}
						>
							<For each={["Solo", "Multiple", "Unknown"] as ArtistType[]}>
								{(type) => <option value={type}>{type}</option>}
							</For>
						</select>
					</div>
				)}
			</Field>

			<FieldArray name="data.localized_names">
				{(fields) => (
					<For each={fields.items}>
						{(_, idx) => (
							<li>
								<Field
									name={`data.localized_names.${idx()}.language_id`}
									type="number"
								>
									{(field, props) => (
										<div>
											<label for={field.name}>Lang</label>
											<input
												{...props}
												id={field.name}
											/>
										</div>
									)}
								</Field>
								<Field name={`data.localized_names.${idx()}.name`}>
									{(field, props) => (
										<div>
											<label for={field.name}>Name</label>
											<input
												{...props}
												id={field.name}
											/>
										</div>
									)}
								</Field>
								<button
									onClick={() => {
										M.remove(formStore, "data.localized_names", {
											at: idx(),
										})
									}}
								>
									Remove
								</button>
							</li>
						)}
					</For>
				)}
			</FieldArray>
			<button
				onClick={() => {
					M.insert(formStore, "data.localized_names", {
						// @ts-ignore
						value: undefined,
					})
				}}
			>
				Add
			</button>

			<FieldArray name="data.aliases">
				{(fields) => (
					<For each={fields.items}>
						{(_, idx) => (
							<li>
								<Field name={`data.aliases.${idx()}`}>
									{(field, props) => (
										<div>
											<label for={field.name}>Lang</label>
											<input
												{...props}
												id={field.name}
											/>
										</div>
									)}
								</Field>
								<button
									onClick={() => {
										M.remove(formStore, "data.aliases", {
											at: idx(),
										})
									}}
								>
									Remove
								</button>
							</li>
						)}
					</For>
				)}
			</FieldArray>
			<button
				onClick={() => {
					M.insert(formStore, "data.aliases", {
						// @ts-ignore
						value: undefined,
					})
				}}
			>
				Add
			</button>

			<FieldArray name="data.text_aliases">
				{(fields) => (
					<For each={fields.items}>
						{(_, idx) => (
							<li>
								<Field name={`data.text_aliases.${idx()}`}>
									{(field, props) => (
										<input
											{...props}
											id={field.name}
										/>
									)}
								</Field>
								<button
									onClick={() => {
										M.remove(formStore, "data.text_aliases", {
											at: idx(),
										})
									}}
								>
									Remove
								</button>
							</li>
						)}
					</For>
				)}
			</FieldArray>
			<button
				onClick={() => {
					M.insert(formStore, "data.text_aliases", {
						// @ts-ignore
						value: undefined,
					})
				}}
			>
				Add
			</button>

			<Field name="data.start_date.value">
				{(field, props) => (
					<div>
						<label for={`data.${props.name}.value`}>Start Date:</label>
						<input
							{...props}
							type="date"
							id={`data.${props.name}.value`}
							value={field.value}
						/>
					</div>
				)}
			</Field>
			<Field name="data.start_date.precision">
				{(_field, props) => (
					<div>
						<select
							id="start_date_prec"
							{...props}
						>
							<option value="">--Please choose an option--</option>
							<For each={["Year", "Month", "Day"] as const}>
								{(precision) => <option value={precision}>{precision}</option>}
							</For>
						</select>
					</div>
				)}
			</Field>

			<Field name="data.end_date.value">
				{(field, props) => (
					<div>
						<label for="end_date_value">End Date:</label>
						<input
							{...props}
							type="date"
							id="end_date_value"
							value={field.value}
						/>
					</div>
				)}
			</Field>
			<Field name="data.end_date.precision">
				{(_field, props) => (
					<div>
						<label for="end_date_prec">End Date:</label>
						<select
							id="end_date_prec"
							{...props}
						>
							<option value="">--Please choose an option--</option>
							<For each={["Year", "Month", "Day"] as const}>
								{(precision) => <option value={precision}>{precision}</option>}
							</For>
						</select>
					</div>
				)}
			</Field>
			<FieldArray name="data.links">
				{(fields) => (
					<For each={fields.items}>
						{(_, idx) => (
							<li>
								<Field name={`data.links.${idx()}`}>
									{(field, props) => (
										<input
											{...props}
											id={field.name}
										/>
									)}
								</Field>
								<button
									onClick={() => {
										M.remove(formStore, "data.links", {
											at: idx(),
										})
									}}
								>
									Remove
								</button>
							</li>
						)}
					</For>
				)}
			</FieldArray>
			<button
				onClick={() => {
					M.insert(formStore, "data.links", {
						// @ts-ignore
						value: undefined,
					})
				}}
			>
				Add
			</button>

			<Location name="start_date" />
			<Location name="end_date" />

			<Field
				name="data.memberships"
				type="string"
			>
				{(field, props) => (
					<div>
						<label for="memberships">Memberships:</label>
						<textarea
							{...props}
							id="memberships"
							value={JSON.stringify(field.value)}
						></textarea>
					</div>
				)}
			</Field>

			<button type="submit">Submit</button>
		</Form>
	)
}
