import type { Component } from "solid-js"
import { For, Show, createMemo } from "solid-js"
import { twMerge } from "tailwind-merge"

type HighlightTextProps = {
	text: string
	keyword: string
	emClass?: string
}

type TextSegment = {
	text: string
	isHighlight: boolean
}

export const HighlightText: Component<HighlightTextProps> = (props) => {
	const segments = createMemo<TextSegment[]>(() => {
		const keyword = props.keyword.trim()
		const text = props.text

		if (!keyword) {
			return [{ text, isHighlight: false }]
		}

		const parts: TextSegment[] = []
		const escapedKeyword = keyword.replaceAll(/[.*+?^${}()|[\]\\]/g, String.raw`\$&`)
		const regex = new RegExp(`(${escapedKeyword})`, "gi")
		let lastIndex = 0

		text.replace(regex, (match, _, offset) => {
			if (offset > lastIndex) {
				parts.push({ text: text.slice(lastIndex, offset), isHighlight: false })
			}
			parts.push({ text: match, isHighlight: true })
			lastIndex = offset + match.length
			return match
		})

		if (lastIndex < text.length) {
			parts.push({ text: text.slice(lastIndex), isHighlight: false })
		}

		return parts
	})
    const emFinalClass = () => twMerge("not-italic font-semibold text-reimu-600", props.emClass)

	return (
		<>
			<For each={segments()}>
				{(segment) => (
					<Show when={segment.isHighlight} fallback={segment.text}>
						<em class={emFinalClass()}>{segment.text}</em>
					</Show>
				)}
			</For>
		</>
	)
}
