import { For } from "solid-js"

import { Player } from "~/components/player"
import { Sidebar } from "~/components/sidebar"
import { PageLayout } from "~/layout/PageLayout"
import { banners, recommendedPlaylists } from "~/views/Homepage/mock"

import { Banner } from "./component/Banner"
import { NewMusic } from "./component/NewMusic"
import { PlaylistCard } from "./component/PlaylistCard"
import { SidebarContent } from "./component/SidebarContent"

export function HomePage() {
	return (
		<PageLayout>
			<div class="flex flex-1">
				{/* 左侧边栏 */}
				<Sidebar class="w-60 border-r border-gray-200 bg-white shadow-sm">
					<SidebarContent />
				</Sidebar>

				{/* 主内容区域 */}
				<div class="flex-1 overflow-auto">
					<div class="p-6">
						{/* 轮播图 */}
						<Banner banners={banners} />

						{/* 推荐歌单 */}
						<div class="mb-8">
							<div class="mb-4 flex items-center justify-between">
								<h2 class="text-xl font-bold text-gray-800">推荐歌单</h2>
								<a
									href="#"
									class="text-sm text-rose-600 hover:text-rose-700"
								>
									查看更多
								</a>
							</div>

							<div class="grid grid-cols-5 gap-4">
								<For each={recommendedPlaylists}>
									{(playlist) => <PlaylistCard playlist={playlist} />}
								</For>
							</div>
						</div>

						{/* 最新音乐 */}
						<NewMusic />
					</div>
				</div>
			</div>
		</PageLayout>
	)
}
