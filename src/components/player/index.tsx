import { createSignal, Show } from "solid-js";

type Song = {
    id: number;
    title: string;
    artist: string;
    coverUrl: string;
    duration: number;
};

export function Player() {
    const [currentSong, setCurrentSong] = createSignal<Song | null>({
        id: 1,
        title: "幻想乡之歌",
        artist: "ZUN",
        coverUrl: "https://placehold.co/60x60/red/white?text=ZUN",
        duration: 180,
    });

    const [isPlaying, setIsPlaying] = createSignal(false);
    const [currentTime, setCurrentTime] = createSignal(0);
    const [volume, setVolume] = createSignal(80);

    const togglePlay = () => {
        setIsPlaying(!isPlaying());
    };

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    return (
        <div class="fixed bottom-0 left-0 right-0 h-20 bg-white border-t border-gray-200 shadow-lg z-50">
            <div class="container mx-auto h-full flex items-center px-4">
                {/* 歌曲信息 */}
                <div class="flex items-center w-1/4">
                    <Show when={currentSong()}>
                        {(song) => (
                            <>
                                <div class="w-12 h-12 rounded overflow-hidden mr-3">
                                    <img
                                        src={song().coverUrl}
                                        alt={song().title}
                                        class="w-full h-full object-cover"
                                    />
                                </div>
                                <div class="overflow-hidden">
                                    <h4 class="text-sm font-medium text-gray-800 truncate">{song().title}</h4>
                                    <p class="text-xs text-gray-500 truncate">{song().artist}</p>
                                </div>
                                <button class="ml-4 text-gray-400 hover:text-rose-600">
                                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                                    </svg>
                                </button>
                            </>
                        )}
                    </Show>
                </div>

                {/* 播放控制 */}
                <div class="flex flex-col items-center justify-center w-2/4">
                    <div class="flex items-center space-x-4">
                        <button class="text-gray-500 hover:text-gray-700">
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12.066 11.2a1 1 0 000 1.6l5.334 4A1 1 0 0019 16V8a1 1 0 00-1.6-.8l-5.333 4zM4.066 11.2a1 1 0 000 1.6l5.334 4A1 1 0 0011 16V8a1 1 0 00-1.6-.8l-5.334 4z" />
                            </svg>
                        </button>

                        <button
                            class="bg-rose-600 text-white rounded-full p-2 hover:bg-rose-700 transition"
                            onClick={togglePlay}
                        >
                            <Show when={isPlaying()} fallback={
                                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                                </svg>
                            }>
                                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </Show>
                        </button>

                        <button class="text-gray-500 hover:text-gray-700">
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12.066 11.2a1 1 0 000 1.6l5.334 4A1 1 0 0019 16V8a1 1 0 00-1.6-.8l-5.333 4zM4.066 11.2a1 1 0 000 1.6l5.334 4A1 1 0 0011 16V8a1 1 0 00-1.6-.8l-5.334 4z" />
                            </svg>
                        </button>
                    </div>

                    <div class="w-full flex items-center mt-2">
                        <span class="text-xs text-gray-500 mr-2">{formatTime(currentTime())}</span>
                        <div class="flex-1 h-1 bg-gray-200 rounded-full overflow-hidden">
                            <div
                                class="h-full bg-rose-600"
                                style={{ width: `${(currentTime() / (currentSong()?.duration || 1)) * 100}%` }}
                            ></div>
                        </div>
                        <span class="text-xs text-gray-500 ml-2">{formatTime(currentSong()?.duration || 0)}</span>
                    </div>
                </div>

                {/* 音量控制 */}
                <div class="flex items-center justify-end w-1/4">
                    <button class="text-gray-500 hover:text-gray-700 mr-2">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                        </svg>
                    </button>

                    <div class="w-24 h-1 bg-gray-200 rounded-full overflow-hidden">
                        <div
                            class="h-full bg-rose-600"
                            style={{ width: `${volume()}%` }}
                        ></div>
                    </div>

                    <button class="text-gray-500 hover:text-gray-700 ml-4">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8h16M4 16h16" />
                        </svg>
                    </button>
                </div>
            </div>
        </div>
    );
} 