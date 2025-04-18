import { createSignal, For, onMount, Show } from "solid-js"

import { releaseAPIResponse as Response } from "./(comp)/mock"
import { type ReleaseAPIResponse } from "./(comp)/type"

type Args = {
	keyword: string
}
export async function getReleaseAPIResponse(
	keyword: string,
): Promise<ReleaseAPIResponse> {
	const baseURL = import.meta.env.VITE_SERVER_URL
	const apiUrl = `http://${baseURL}/api/releases?keyword=${encodeURIComponent(keyword)}`

	try {
		const response = await fetch(apiUrl, {
			method: "GET",
			headers: {
				"Content-Type": "application/json",
			},
		})

		if (!response.ok) {
			throw new Error(`HTTP error! status: ${response.status}`)
		}

		const data: ReleaseAPIResponse =
			(await response.json()) as ReleaseAPIResponse
		return data
	} catch (error) {
		console.error("Failed to fetch release data:", error)
		throw error
	}
}

const [release, setRelease] = createSignal<ReleaseAPIResponse | null>(null)

// eslint-disable-next-line @typescript-eslint/no-misused-promises
onMount(async () => {
	const res = await getReleaseAPIResponse("Lena Ray")
	setRelease(res)
})

//todo 将展示数据替换为真实数据，优化颜色配比，根据曲目渲染， tanStackRouter开发者工具导致页面被挤压
function ReleasePage(args: Args) {
	return (
		<div class="mx-5 h-full bg-gray-100">
			{/**header */}
			<div class="mx-auto flex h-[25%] w-full bg-gray-200">
				<div class="h-full w-[20%]">
					<img
						class="h-full w-full rounded-lg"
						src="https://th.bing.com/th/id/OIP.1JqzUmtCX3Ng-8i-n5_kHgAAAA?w=120&h=104&c=7&bgcl=de1aa5&r=0&o=6&dpr=1.5&pid=13.1"
						alt=""
					/>
				</div>
				<div class="flex h-full w-[80%] flex-col pt-3 pl-5">
					<h2 class="text-3xl">
						{Response.data[0]?.localized_titles[0]?.title}
					</h2>
					<h3 class="text-sm">{Response.data[0]?.artists[0]?.name}</h3>
					<h3 class="mt-auto text-xs">{Response.data[0]?.release_date}</h3>
				</div>
			</div>
			{/**detail */}
			<div class="mx-auto flex h-[75%] w-full flex-col">
				<Show when={Response.data[0]?.release_type}>
					类型:{Response.data[0]?.release_type}
				</Show>
				<For each={Response.data[0]?.artists ?? []}>
					{(artist) => <div>歌手:{artist.name}</div>}
				</For>

				<For each={Response.data[0]?.credits ?? []}>
					{(credits) => (
						<div>
							{credits.role.name}:{credits.artist.name}
						</div>
					)}
				</For>
                <Show when={Response.data[0]?.catalog_nums[0]?.catalog_number}>
                    唱片编号:{Response.data[0]?.catalog_nums[0]?.catalog_number}
                </Show>
			</div>
		</div>
	)
}

export default function (args: Args) {
	return <ReleasePage keyword={args.keyword} />
}
