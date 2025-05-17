import { Title } from "@solidjs/meta"
import { createFileRoute } from "@tanstack/solid-router"
import { For, createMemo } from "solid-js"
import { Player } from "~/components/player"
import { ListItem, Sidebar } from "~/components/sidebar"
import { HomeIcon, HeartIcon, ClockIcon, StarIcon, CardStackIcon, EnvelopeClosedIcon, MixerHorizontalIcon, PersonIcon, PlayIcon, TargetIcon, CrumpledPaperIcon } from "solid-radix-icons"
// 自定义MusicNoteIcon因为solid-radix-icons中没有
const MusicNoteIcon = (props: { class?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="15"
    height="15"
    viewBox="0 0 15 15"
    fill="none"
    stroke="currentColor"
    stroke-width="1"
    stroke-linecap="round"
    stroke-linejoin="round"
    {...props}
  >
    <path d="M5.5 10.5V4L10.5 3V9M5.5 6L10.5 5M8 10.5C8 11.3284 7.32843 12 6.5 12C5.67157 12 5 11.3284 5 10.5C5 9.67157 5.67157 9 6.5 9C7.32843 9 8 9.67157 8 10.5ZM13 9.5C13 10.3284 12.3284 11 11.5 11C10.6716 11 10 10.3284 10 9.5C10 8.67157 10.6716 8 11.5 8C12.3284 8 13 8.67157 13 9.5Z" />
  </svg>
)

// 自定义 RankingIcon
const RankingIcon = (props: { class?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="15"
    height="15"
    viewBox="0 0 15 15"
    fill="none"
    stroke="currentColor"
    stroke-width="1"
    stroke-linecap="round"
    stroke-linejoin="round"
    {...props}
  >
    <path d="M3.5 2v11M7.5 5.5v7.5M11.5 2v11M3.5 11.5h8M3.5 7.5h4M3.5 3.5h8" />
  </svg>
)

export const Route = createFileRoute("/")({
  component: HomePage,
})

function HomePage() {
  const recommendedPlaylists = [
    { id: 1, title: "秘封俱乐部", coverUrl: "https://placehold.co/200x200/red/white?text=秘封俱乐部", creator: "紫妈" },
    { id: 2, title: "幻想乡民谣", coverUrl: "https://placehold.co/200x200/red/white?text=幻想乡民谣", creator: "灵梦" },
    { id: 3, title: "红魔馆之夜", coverUrl: "https://placehold.co/200x200/red/white?text=红魔馆之夜", creator: "蕾米莉亚" },
    { id: 4, title: "妖怪山电音", coverUrl: "https://placehold.co/200x200/red/white?text=妖怪山电音", creator: "天子" },
    { id: 5, title: "永夜的幻想", coverUrl: "https://placehold.co/200x200/red/white?text=永夜的幻想", creator: "辉夜" }
  ];

  const banners = [
    { id: 1, imageUrl: "https://placehold.co/1200x300/red/white?text=东方同音鉴新发布", title: "东方同音鉴新发布" },
    { id: 2, imageUrl: "https://placehold.co/1200x300/8a2be2/white?text=新专辑上线", title: "新专辑上线" },
    { id: 3, imageUrl: "https://placehold.co/1200x300/ff69b4/white?text=音乐会回顾", title: "音乐会回顾" }
  ];

  // 选择当前显示的轮播图
  const currentBanner = createMemo(() => banners[0] || { imageUrl: "", title: "" });

  return (
    <div class="flex flex-col min-h-screen bg-gray-50">
      <div class="flex flex-1">
        {/* 左侧边栏 */}
        <Sidebar class="w-60 bg-white shadow-sm border-r border-gray-200">
          <div class="p-4">
            <div class="mb-6">
              <h3 class="text-xs font-medium text-gray-500 mb-2">发现音乐</h3>
              <ul class="space-y-1">
                <ListItem>
                  <TargetIcon class="w-4 h-4 mr-3" />
                  <span>推荐</span>
                </ListItem>
                <ListItem>
                  <RankingIcon class="w-4 h-4 mr-3" />
                  <span>排行榜</span>
                </ListItem>
                <ListItem>
                  <CardStackIcon class="w-4 h-4 mr-3" />
                  <span>歌单</span>
                </ListItem>
                <ListItem>
                  <CrumpledPaperIcon class="w-4 h-4 mr-3" />
                  <span>专辑</span>
                </ListItem>
                <ListItem>
                  <MixerHorizontalIcon class="w-4 h-4 mr-3" />
                  <span>社团</span>
                </ListItem>
                <ListItem>
                  <EnvelopeClosedIcon class="w-4 h-4 mr-3" />
                  <span>活动</span>
                </ListItem>
              </ul>
            </div>

            <div class="mb-6">
              <h3 class="text-xs font-medium text-gray-500 mb-2">我的音乐</h3>
              <ul class="space-y-1">
                <ListItem>
                  <MusicNoteIcon class="w-4 h-4 mr-3" />
                  <span>本地音乐</span>
                </ListItem>
                <ListItem>
                  <PlayIcon class="w-4 h-4 mr-3" />
                  <span>播放列表</span>
                </ListItem>
                <ListItem>
                  <PersonIcon class="w-4 h-4 mr-3" />
                  <span>个人中心</span>
                </ListItem>
              </ul>
            </div>

            <div>
              <h3 class="text-xs font-medium text-gray-500 mb-2">创建的歌单</h3>
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
        </Sidebar>

        {/* 主内容区域 */}
        <div class="flex-1 overflow-auto">
          <div class="p-6">
            <Title>东方同音鉴 - 发现幻想乡的音乐</Title>

            {/* 轮播图 */}
            <div class="mb-8">
              <div class="relative h-64 rounded-lg overflow-hidden shadow-md">
                <img
                  src={currentBanner().imageUrl}
                  alt={currentBanner().title}
                  class="w-full h-full object-cover"
                />
                <div class="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
                  <h2 class="text-white text-xl font-bold">{currentBanner().title}</h2>
                </div>

                {/* 轮播指示器 */}
                <div class="absolute bottom-3 right-3 flex space-x-2">
                  <For each={banners}>
                    {(banner, index) => (
                      <div class={`w-2 h-2 rounded-full ${index() === 0 ? 'bg-white' : 'bg-white/50'}`}></div>
                    )}
                  </For>
                </div>
              </div>
            </div>

            {/* 推荐歌单 */}
            <div class="mb-8">
              <div class="flex items-center justify-between mb-4">
                <h2 class="text-xl font-bold text-gray-800">推荐歌单</h2>
                <a href="#" class="text-sm text-rose-600 hover:text-rose-700">查看更多</a>
              </div>

              <div class="grid grid-cols-5 gap-4">
                <For each={recommendedPlaylists}>
                  {playlist => (
                    <div class="bg-white rounded-lg overflow-hidden shadow hover:shadow-md transition-shadow">
                      <div class="aspect-square overflow-hidden">
                        <img
                          src={playlist.coverUrl}
                          alt={playlist.title}
                          class="w-full h-full object-cover hover:scale-105 transition-transform"
                        />
                      </div>
                      <div class="p-3">
                        <h3 class="text-sm font-medium text-gray-800 line-clamp-2 hover:text-rose-600">{playlist.title}</h3>
                        <p class="text-xs text-gray-500 mt-1">by {playlist.creator}</p>
                      </div>
                    </div>
                  )}
                </For>
              </div>
            </div>

            {/* 最新音乐 */}
            <div>
              <div class="flex items-center justify-between mb-4">
                <h2 class="text-xl font-bold text-gray-800">最新音乐</h2>
                <a href="#" class="text-sm text-rose-600 hover:text-rose-700">查看更多</a>
              </div>

              <div class="bg-white rounded-lg shadow p-4">
                <div class="grid grid-cols-2 gap-4">
                  <For each={Array(6).fill(0)}>
                    {(_, i) => (
                      <div class="flex items-center p-2 hover:bg-gray-50 rounded-md">
                        <div class="w-10 h-10 bg-rose-100 flex-shrink-0 rounded overflow-hidden">
                          <img src={`https://placehold.co/100x100/red/white?text=${i() + 1}`} alt="封面" class="w-full h-full object-cover" />
                        </div>
                        <div class="ml-3 flex-1 overflow-hidden">
                          <h4 class="text-sm font-medium text-gray-800 truncate">东方同音鉴曲目 {i() + 1}</h4>
                          <p class="text-xs text-gray-500 truncate">幻想乡音乐人</p>
                        </div>
                        <button class="p-2 text-gray-400 hover:text-rose-600">
                          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                        </button>
                      </div>
                    )}
                  </For>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 添加播放器 */}
      <Player />
    </div>
  )
}
