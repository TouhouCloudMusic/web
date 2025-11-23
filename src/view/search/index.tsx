import { useNavigate, useSearch } from "@tanstack/solid-router"
import { Show } from "solid-js"
import { MagnifyingGlassIcon } from "solid-radix-icons"

import { Tab } from "~/component/atomic"
import { Input } from "~/component/atomic/Input"
import { PageLayout } from "~/layout/PageLayout"
import { GeneralSearchResult } from "./comp/GeneralSearchResult"

export function SearchView() {
	const search = useSearch({ from: "/search" })
	const keyword = () => search().keyword

	return (
		<Show
			when={keyword()}
			fallback={<DefaultSearchPage />}
		>
			<PageLayout class="p-8">
				<div class="flex-1">
					<h1 class="mb-3 text-2xl font-bold text-slate-800">
						Search results of "{keyword()}"
					</h1>
					<SearchTabs />
				</div>
			</PageLayout>
		</Show>
	)
}

function DefaultSearchPage() {
	const navigate = useNavigate()
	let inputRef: HTMLInputElement

	const handleSubmit = (e: Event) => {
		e.preventDefault()
		const keyword = inputRef.value.trim()
		if (keyword) {
			navigate({ to: "/search", search: { keyword } })
		}
	}

	return (
		<PageLayout class="flex items-center justify-center">
			<div class="flex flex-col items-center gap-6">
				<h1 class="text-4xl font-bold text-slate-800">
					THC Search
				</h1>
				<form
					class="relative flex items-center"
					onSubmit={handleSubmit}
				>
					<Input
						ref={(el) => (inputRef = el)}
						class="h-12 w-[600px] pl-12 text-base"
						placeholder="搜索歌曲、艺术家、专辑..."
					/>
					<MagnifyingGlassIcon class="absolute left-4 size-5 text-slate-400" />
				</form>
			</div>
		</PageLayout>
	)
}

const TRIGGER_CLASS = "py-3 text-sm"
function SearchTabs() {
	return (
		<Tab.Root>
			<div class="border-b border-slate-300 px-2">
				<Tab.List class="grid-cols-4 gap-4">
					<Tab.Trigger
						value="General"
						class={TRIGGER_CLASS}
					>
						General
					</Tab.Trigger>
					<Tab.Trigger
						value="Songs"
						class={TRIGGER_CLASS}
					>
						Songs
					</Tab.Trigger>
					<Tab.Trigger
						value="Artists"
						class={TRIGGER_CLASS}
					>
						Artists
					</Tab.Trigger>
					<Tab.Trigger
						value="Releases"
						class={TRIGGER_CLASS}
					>
						Releases
					</Tab.Trigger>
					<Tab.Trigger
						value="Events"
						class={TRIGGER_CLASS}
					>
						Events
					</Tab.Trigger>
					<Tab.Indicator />
				</Tab.List>
			</div>
			<Tab.Content
				value="General"
				class="p-4"
			>
				<GeneralSearchResult />
			</Tab.Content>
			<Tab.Content
				value="Songs"
				class="p-4"
			>
				<div class="text-slate-600">Songs search results</div>
			</Tab.Content>
			<Tab.Content
				value="Artists"
				class="p-4"
			>
				<div class="text-slate-600">Artists search results</div>
			</Tab.Content>
			<Tab.Content
				value="Releases"
				class="p-4"
			>
				<div class="text-slate-600">Releases search results</div>
			</Tab.Content>
			<Tab.Content
				value="Events"
				class="p-4"
			>
				<div class="text-slate-600">Events search results</div>
			</Tab.Content>
		</Tab.Root>
	)
}
