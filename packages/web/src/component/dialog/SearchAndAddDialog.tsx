import { For, JSX } from "solid-js"
import { Cross2Icon, MagnifyingGlassIcon, PlusIcon } from "solid-radix-icons"
import { twMerge } from "tailwind-merge"
import { TertiaryButton } from "../button/index.tsx"
import { Dialog } from "../form/Dialog/index.ts"
import { TextField } from "../form/index.tsx"

export function SearchAndAddDialog<T extends Record<string, unknown>>(props: {
	// onSearch: (args: string) => unknown
	data: T[]
	// setData: (args: T) => unknown
	ListItem: (props: { data: T }) => JSX.Element
}) {
	const onSubmit = (e: Event) => {
		e.preventDefault()
		// @ts-ignore
		props.onInsert()
	}

	return (
		<Dialog.Layout
			defaultOpen
			trigger={
				<TertiaryButton
					size="xs"
					class="aspect-square p-1.5">
					<PlusIcon />
				</TertiaryButton>
			}>
			<Dialog.Content class="flex max-h-[75%] min-h-[32rem] max-w-sm flex-col px-0 pb-8">
				<div class="mx-4 flex justify-between">
					<Dialog.Title class="text-lg font-medium">Add Alias</Dialog.Title>
					<Dialog.CloseButton class="p-1">
						<Cross2Icon />
					</Dialog.CloseButton>
				</div>
				<form
					onSubmit={onSubmit}
					class="relative mx-4 mt-3 grid grid-rows-1">
					<div class="absolute w-8 self-center">
						<MagnifyingGlassIcon class="mx-auto size-4" />
					</div>
					<input
						class={twMerge(
							TextField.Input.className,
							`border-none bg-slate-100 pl-8 ring-0`
						)}
					/>
				</form>

				<ul class="bg-secondary mt-6 flex w-full grow flex-col overflow-auto border-y-[1.5px] border-slate-100 *:min-h-16">
					<For each={props.data}>
						{(data) => (
							<li class="bg-primary flex size-5 w-full justify-between border-y-[1.5px] border-slate-100 px-4 *:self-center">
								<props.ListItem data={data} />
							</li>
						)}
					</For>

					{/* {fakeData.map((x) => (
						<li class="bg-primary flex size-5 w-full justify-between border-y-[1.5px] border-slate-100 px-4 *:self-center">
							<div>
								<p>{x.name}</p>
								<span class="text-tertiary">lorem ipsum</span>
							</div>
							<TertiaryButton
								class="aspect-square min-h-6"
								onClick={() =>
									addAlias({
										name: x.name,
										is_str: false,
									})
								}>
								<PlusIcon class="m-auto" />
							</TertiaryButton>
						</li>
					))} */}
				</ul>
			</Dialog.Content>
		</Dialog.Layout>
	)
}
