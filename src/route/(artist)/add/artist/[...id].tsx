import {
	Field,
	FieldArray,
	Form,
	getValues,
	setValues
} from "@modular-forms/solid"
import {
	Params,
	action,
	cache,
	createAsync,
	redirect,
	useAction,
	useParams,
} from "@solidjs/router"
import { either } from "fp-ts"
import { pipe } from "fp-ts/lib/function"
import {
	For,
	Index,
	Match,
	Show,
	Switch,
	createContext,
	onMount,
} from "solid-js"
import { Cross1Icon } from "solid-radix-icons"
import { Button } from "~/component/button"
import { FormComp } from "~/component/form"
import {
	ArtistDataByID,
	findArtistByID,
} from "~/database/artist/find_artist_by_id"
import { useContextUnsave } from "~/lib/context/use_context_save"
import { NotFoundError } from "~/lib/error/errors"
import { isEmptyOrValidID } from "~/lib/validate/validate_params"
import { createController } from "./controller"
import { ArtistForm } from "./type"
import { initFormStore_Member } from "./utils"

const getArtistDataByID_EditPage = cache(async function (params: Params) {
	return await pipe(
		params,
		isEmptyOrValidID,
		either.match(
			() => {
				throw redirect("/404")
			},
			async (id) => {
				if (!id) return
				else
					return pipe(
						await findArtistByID(id),
						either.match(
							(e) => {
								if (e instanceof NotFoundError) return undefined
								// TODO: 研究如何把error发到客户端上
								else {
									console.log(e)
									throw redirect("/500")
								}
							},
							(d) => d
						)
					)
			}
		)
	)
}, `artist_by_id_edit`)

const submitAction = action(
	// eslint-disable-next-line @typescript-eslint/require-await
	async (formData: ArtistForm, initData: ArtistDataByID | undefined) => {
		console.log(formData)

		// createOrUpdateArtist(formData, initData)
		console.log("Ok")
	},
	"add_artist"
)

const h4Class = `text-[1.1rem] font-semibold`

const EditArtistPageContext =
	createContext<ReturnType<typeof createController>>()
const EditArtistPageController = useContextUnsave(EditArtistPageContext)

export default function EditArtistPage() {
	const controller = createController()
	return (
		<Show when={controller}>
			<EditArtistPageContext.Provider value={controller}>
				<Main />
			</EditArtistPageContext.Provider>
		</Show>
	)
}

function Main() {
	const data = createAsync(() => getArtistDataByID_EditPage(useParams()))
	const { artistData, setArtistData, formStore, type } =
		EditArtistPageController()
	const action = useAction(submitAction)
	onMount(() => {
		const initData = data()
		if (initData) {
			setArtistData(initData)
			type.setType(initData.type)
			setValues(formStore, {
				id: data()?.id.toString(),
				name: data()?.name,
				type: data()?.type,
				member: initFormStore_Member(initData),
					// data()?.type === "Person" ?
					// 	data()?.member_of.map(
					// 		(a): MemberListItem =>
					// 			a.group?.id ?
					// 				{
					// 					artist_id: a.group.id.toString(),
					// 					group_member_id: a.id.toString(),
					// 					type: a.group.type,
					// 					name: a.group.name,
					// 					isString: false,
					// 				}
					// 			:	{
					// 					artist_id: "",
					// 					group_member_id: a.id.toString(),
					// 					type: "Group" as ArtistType,
					// 					name: a.name ?? "",
					// 					isString: true,
					// 				}
					// 	)
					// :	data()?.members.map(
					// 		(a): MemberListItem =>
					// 			a.artist?.id ?
					// 				{
					// 					artist_id: a.artist.id.toString(),
					// 					group_member_id: a.id.toString(),
					// 					type: a.artist.type,
					// 					name: a.artist.name,
					// 					isString: false,
					// 				}
					// 			:	{
					// 					artist_id: "",
					// 					group_member_id: a.id.toString(),
					// 					type: "Person" as ArtistType,
					// 					name: a.name ?? "",
					// 					isString: true,
					// 				}
					// 	),
			})
		}
	})
	return (
		<Form
			of={formStore}
			onSubmit={(v) => action(v, data())}
			method="post"
			class="flex flex-col gap-2">
			<Field
				of={formStore}
				name="id">
				{(field, props) => (
					<>
						<input
							{...props}
							type="text"
							value={artistData()?.id.toString() ?? ""}
							hidden
						/>
						{field.error && <p>{field.error}</p>}
					</>
				)}
			</Field>
			<Name />
			<Type />
			<Member />
			<Button.Highlight
				type="submit"
				class="w-1/3 self-start">
				Submit
			</Button.Highlight>
			<Button.Highlight
				type="button"
				class="w-1/3 self-start"
				onClick={() => console.log(getValues(formStore))}>
				Log
			</Button.Highlight>
			<div>{formStore.response.message}</div>
		</Form>
		// <Form
		// 	onSubmit={action}
		// 	class="flex flex-col gap-2">
		// 	<div class="flex flex-col">
		// 		<Field name="name">
		// 			{(field, props) => (
		// 				<>
		// 					<label for="name">Name</label>
		// 					<input
		// 						{...props}
		// 						type="text"
		// 						required
		// 					/>
		// 					{field.error && <FormComp.ErrorText text={field.error} />}
		// 				</>
		// 			)}
		// 		</Field>
		// 	</div>

		// 	<div class="flex flex-col">
		// 		<h4>Artist Type</h4>
		// 		<Field name="type">
		// 			{(field, props) => (
		// 				<>
		// 					<div class="flex">
		// 						<input
		// 							{...props}
		// 							type="radio"
		// 							id="artist_type_person"
		// 							value="Person"
		// 						/>
		// 						<label for="artist_type_person">Person</label>
		// 					</div>
		// 					<div class="flex">
		// 						<input
		// 							{...props}
		// 							type="radio"
		// 							id="artist_type_group"
		// 							value="Group">
		// 							Group
		// 						</input>
		// 						<label for="artist_type_group">Group</label>
		// 					</div>
		// 					{field.error && <FormComp.ErrorText text={field.error} />}
		// 				</>
		// 			)}
		// 		</Field>
		// 	</div>
		// 	<Member />
		// 	<Button.Highlight
		// 		type="submit"
		// 		class="w-1/3 self-start">
		// 		Submit
		// 	</Button.Highlight>
		// </Form>
	)
}
function Name() {
	const { artistData, formStore } = EditArtistPageController()
	return (
		<Field
			of={formStore}
			name="name">
			{(field, props) => (
				<div class="flex flex-col">
					<label
						for="name"
						class={h4Class}>
						Name
					</label>
					<input
						{...props}
						type="text"
						class={`h-7 w-2/3 rounded border border-gray-400 px-2 outline-none focus:border-blue-700 focus:ring-1 focus:ring-blue-600`}
						classList={{
							"invalid:focus:ring-red-800 invalid:focus:border-red-800":
								field.error.length > 0,
						}}
						value={artistData() !== undefined ? artistData()?.name : undefined}
						required
					/>
					{field.error && <FormComp.ErrorText text={field.error} />}
				</div>
			)}
		</Field>
	)
}

function Type() {
	const { artistData, formStore, type } = EditArtistPageController()
	return (
		<div class="flex flex-col">
			<h4 class={h4Class}>Artist Type</h4>
			<Field
				of={formStore}
				name="type">
				{(field, props) => (
					<>
						<div class="flex">
							<input
								{...props}
								type="radio"
								id="artist_type_person"
								value="Person"
								checked={artistData()?.type === "Person"}
								onChange={() => type.toPerson()}
							/>
							<label for="artist_type_person">Person</label>
						</div>
						<div class="flex">
							<input
								{...props}
								type="radio"
								id="artist_type_group"
								value="Group"
								checked={artistData()?.type === "Group"}
								onChange={() => type.toGroup()}>
								Group
							</input>
							<label for="artist_type_group">Group</label>
						</div>
						{field.error && <FormComp.ErrorText text={field.error} />}
					</>
				)}
			</Field>
		</div>
	)
}

function Member() {
	const { formStore, type, member } = EditArtistPageController()
	return (
		<div class="flex min-h-64 gap-2">
			<div class="flex w-64 flex-col">
				<h4 class={h4Class}>
					<Switch>
						<Match when={type.value === "Person"}>Member of</Match>
						<Match when={type.value === "Group"}>Members</Match>
						<Match when={type.value === undefined}>
							<span class="text-sm">Please Select Artist Type</span>
						</Match>
					</Switch>
				</h4>
				<ul class="flex flex-col gap-2">
					<FieldArray
						of={formStore}
						name="member">
						{(fieldArray) => (
							<>
								<For each={fieldArray.items}>
									{(_, index) => (
										<>
											<Field
												of={formStore}
												name={`member.${index()}.artist_id`}>
												{(field, props) => (
													<>
														<input
															{...props}
															type="text"
															value={field.value}
															hidden
														/>
														{field.error && (
															<FormComp.ErrorText text={field.error} />
														)}
													</>
												)}
											</Field>
											<Field
												of={formStore}
												name={`member.${index()}.name`}>
												{(field) => (
													<li class="shadow-2 flex place-content-between gap-2 rounded bg-highlight p-2">
														<p>{field.value}</p>
														<Button.Warning
															type="button"
															class="flex h-6 w-6 place-content-center text-sm"
															onClick={() => member.remove(index())}>
															<Cross1Icon class="bold size-4 place-self-center stroke-white" />
														</Button.Warning>
														{field.error && (
															<FormComp.ErrorText text={field.error} />
														)}
													</li>
												)}
											</Field>
											<Field
												of={formStore}
												name={`member.${index()}.type`}>
												{(field, props) => (
													<>
														<input
															{...props}
															type="text"
															value={field.value}
															hidden
														/>
														{field.error && (
															<FormComp.ErrorText text={field.error} />
														)}
													</>
												)}
											</Field>
											<Field
												of={formStore}
												name={`member.${index()}.isString`}
												type="boolean">
												{(field, props) => (
													<>
														<input
															{...props}
															type="checkbox"
															checked={field.value}
															hidden
														/>
														{field.error && (
															<FormComp.ErrorText text={field.error} />
														)}
													</>
												)}
											</Field>
										</>
									)}
								</For>
								{fieldArray.error && (
									<FormComp.ErrorText text={fieldArray.error} />
								)}
							</>
						)}
					</FieldArray>
				</ul>
			</div>

			<div class="flex flex-col">
				<h4 class={h4Class}>Add Artist</h4>
				<input
					type="text"
					placeholder="Search artist"
					class="px-1"
					onInput={(e) => member.serach(e.currentTarget.value)}
					disabled={type.value !== "Group" && type.value !== "Person"}
				/>
				<div class="relative">
					<div class="absolute w-full">
						<Index each={member.searchResult()}>
							{(artist) => (
								<button
									type="button"
									class="border-sm my-2 w-full border-gray-300 bg-white px-2"
									onClick={() => member.add(artist())}>
									{artist().name}
								</button>
							)}
						</Index>
					</div>
				</div>
			</div>
		</div>
	)
}
