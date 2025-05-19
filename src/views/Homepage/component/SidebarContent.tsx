import {
	CardStackIcon,
	EnvelopeClosedIcon,
	MixerHorizontalIcon,
	PersonIcon,
	PlayIcon,
	TargetIcon,
	CrumpledPaperIcon,
} from "solid-radix-icons"

import { MusicNoteIcon, RankingIcon } from "~/components/icons/custom"
import { ListItem } from "~/components/sidebar"

export function SidebarContent() {
	return (
		<div class="p-4">
			<div class="mb-6">
				<h3 class="mb-2 text-xs font-medium text-gray-500">发现音乐</h3>
				<ul class="space-y-1">
					<ListItem>
						<TargetIcon class="mr-3 h-4 w-4" />
						<span>推荐</span>
					</ListItem>
					<ListItem>
						<RankingIcon class="mr-3 h-4 w-4" />
						<span>排行榜</span>
					</ListItem>
					<ListItem>
						<CardStackIcon class="mr-3 h-4 w-4" />
						<span>歌单</span>
					</ListItem>
					<ListItem>
						<CrumpledPaperIcon class="mr-3 h-4 w-4" />
						<span>专辑</span>
					</ListItem>
					<ListItem>
						<MixerHorizontalIcon class="mr-3 h-4 w-4" />
						<span>社团</span>
					</ListItem>
					<ListItem>
						<EnvelopeClosedIcon class="mr-3 h-4 w-4" />
						<span>活动</span>
					</ListItem>
				</ul>
			</div>

			<div class="mb-6">
				<h3 class="mb-2 text-xs font-medium text-gray-500">我的音乐</h3>
				<ul class="space-y-1">
					<ListItem>
						<MusicNoteIcon class="mr-3 h-4 w-4" />
						<span>本地音乐</span>
					</ListItem>
					<ListItem>
						<PlayIcon class="mr-3 h-4 w-4" />
						<span>播放列表</span>
					</ListItem>
					<ListItem>
						<PersonIcon class="mr-3 h-4 w-4" />
						<span>个人中心</span>
					</ListItem>
				</ul>
			</div>

			<div>
				<h3 class="mb-2 text-xs font-medium text-gray-500">创建的歌单</h3>
				<ul class="space-y-1">
					<ListItem>
						<span>我的歌单1</span>
					</ListItem>
					<ListItem>
						<span>幻想乡音乐精选</span>
					</ListItem>
				</ul>
			</div>
		</div>
	)
}
