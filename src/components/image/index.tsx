import { createSignal, createMemo, Show, type JSX } from "solid-js"
import { Portal } from "solid-js/web"
import { twMerge } from "tailwind-merge"

export interface ImageProps extends JSX.ImgHTMLAttributes<HTMLImageElement> {
	placeholder?: JSX.Element
	errorContent?: JSX.Element
	enablePreview?: boolean
	previewClass?: string
}

// 默认占位组件
const DefaultPlaceholder = () => (
	<div class="flex h-full w-full animate-pulse items-center justify-center bg-gray-200">
		<img
        class="w-3/4 m-auto"
        src="/img/cover/release/1.png"
        alt="Loading..."
        />
	</div>
)

// 默认错误组件
const DefaultErrorContent = () => (
	<div class="flex h-full w-full items-center justify-center bg-red-100">
		<img
        class="w-3/4 m-auto"
        src="/img/status_code/404.png"
        alt="Not Found"
        />
	</div>
)

export function Image(props: ImageProps) {
	const [isLoaded, setIsLoaded] = createSignal(false)
	const [isError, setIsError] = createSignal(false)
	const [isPreviewOpen, setIsPreviewOpen] = createSignal(false)

	const IMAGE_CLASS = "object-cover"

	const classes = createMemo(() =>
		twMerge(IMAGE_CLASS, props.class, isLoaded() ? "" : "hidden"),
	)

	const handleLoad = () => {
		setIsLoaded(true)
		setIsError(false)
	}

	const handleError = () => {
		setIsLoaded(true)
		setIsError(true)
	}

	const togglePreview = () => {
		if (props.enablePreview) {
			setIsPreviewOpen(!isPreviewOpen())
		}
	}

	const handleKeyToggle = (e: KeyboardEvent) => {
		if (e.key === "Enter" || e.key === " ") {
			togglePreview()
		}
	}

	return (
		<div class="relative h-full w-full">
			{/* 占位内容 */}
			<Show when={!isLoaded()}>
				{props.placeholder ?? <DefaultPlaceholder />}
			</Show>

			{/* 错误内容 */}
			<Show when={isError()}>
				{props.errorContent ?? <DefaultErrorContent />}
			</Show>

			{/* 主图 */}
			<Show when={props.enablePreview && !isError()} >
				<button
					type="button"
					onClick={togglePreview}
					class="h-full w-full cursor-zoom-in border-none bg-transparent p-0"
				>
					<img
						{...props}
						alt={props.alt ?? ""}
						loading={props.loading ?? "lazy"}
						class={classes()}
						onLoad={handleLoad}
						onError={handleError}
					/>
				</button>
			</Show>

			<Show when={!props.enablePreview && !isError()}>
				<img
					{...props}
					alt={props.alt ?? ""}
					loading={props.loading ?? "lazy"}
					class={classes()}
					onLoad={handleLoad}
					onError={handleError}
				/>
			</Show>

			{/* 预览模态框 */}
			<Show when={isPreviewOpen() && props.enablePreview}>
				<Portal>
					<button
						type="button"
						onClick={togglePreview}
						onKeyDown={handleKeyToggle}
						class={twMerge(
							"bg-opacity-75 fixed inset-0 z-50 flex items-center justify-center bg-black",
							props.previewClass,
							// 移除原生 button 样式
							"m-0 cursor-zoom-out appearance-none border-none p-0",
						)}
					>
						<img
							src={props.src}
							alt={props.alt}
							class="max-h-[90%] max-w-[90%] object-contain"
						/>
					</button>
				</Portal>
			</Show>
		</div>
	)
}
