import { useLocation, useNavigate, useSearch } from "@tanstack/solid-router"
import { createEffect, createMemo, Show } from "solid-js"
import { MagnifyingGlassIcon } from "solid-radix-icons"

import { Input } from "~/component/atomic/Input"

export function SearchBar() {
	const navigate = useNavigate()
	const location = useLocation()
	const search = useSearch({ strict: false })
	let inputRef: HTMLInputElement

	const isSearchPage = createMemo(() => location().pathname === "/search")
	const hasKeyword = createMemo(() => {
		const keyword = search().keyword
		return keyword && typeof keyword === "string" && keyword.trim().length > 0
	})
	const shouldHide = createMemo(() => isSearchPage() && !hasKeyword())
	const shouldExpand = createMemo(() => isSearchPage() && hasKeyword())

    // 同步输入框内容与 URL 中的搜索关键词
	createEffect(() => {
		const keyword = search().keyword
		if (keyword && typeof keyword === "string") {
			inputRef.value = keyword
		}
	})

	const handleSubmit = (e: Event) => {
		e.preventDefault()
		const keyword = inputRef.value.trim()
		if (keyword) {
			navigate({ to: "/search", search: { keyword, type: "general" } })
		}
	}

	return (
		<Show when={!shouldHide()}>
			<form
				class="grid items-center"
				classList={{
					"ml-36 w-fit": !shouldExpand(),
					"grow max-w-2xl min-w-0 mx-4": !!shouldExpand(),
				}}
				onSubmit={handleSubmit}
			>
				<Input
					ref={(el) => (inputRef = el)}
					class="mr-auto h-7 pl-7 text-xs w-full"
					classList={{
						"w-96": !shouldExpand(),
						"w-full": !!shouldExpand(),
					}}
					placeholder="搜索歌曲、艺术家、专辑..."
				/>
				<MagnifyingGlassIcon class={"absolute col-start-1 ml-2 size-4"} />
			</form>
		</Show>
	)
}
