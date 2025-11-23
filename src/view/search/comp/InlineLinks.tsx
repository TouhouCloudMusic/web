import type { Component } from "solid-js"
import { useNavigate } from "@tanstack/solid-router"
import { For } from "solid-js"

type InlineLinksProps = {
    items: { text: string; link: string }[]
}

export const InlineLinks: Component<InlineLinksProps> = (props) => {
    const navigate = useNavigate()
    return (
        <div class="inline-flex min-w-0 text-xs text-slate-600">
            <For each={props.items}>
                {(item, index) => (
                    <>
                        <a 
                            href={item.link} 
                            onClick={(e) => {
                                e.preventDefault()
                                e.stopPropagation()
                                navigate({ to: item.link })
                            }} 
                            class="hover:underline"
                        >
                            {item.text}
                        </a>
                        {index() < props.items.length - 1 && (
                            <span class="shrink-0 pr-1 pl-0.5">,</span>
                        )}
                    </> 
                )}
            </For>
        </div>
    )
}
