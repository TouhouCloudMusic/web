import { useNavigate } from "@tanstack/solid-router"
import { MagnifyingGlassIcon } from "solid-radix-icons"

import { Input } from "~/component/atomic/Input"

export function SearchBar() {
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
		<form
			class="ml-36 grid w-fit items-center"
			onSubmit={handleSubmit}
		>
			<Input
				ref={(el) => (inputRef = el)}
				class="mr-auto h-7 w-96 pl-7 text-sm"
				placeholder="搜索歌曲、艺术家、专辑..."
			/>
			<MagnifyingGlassIcon class={"absolute col-start-1 ml-2 size-4"} />
		</form>
	)
}
