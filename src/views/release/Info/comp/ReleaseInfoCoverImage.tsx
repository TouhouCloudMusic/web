import { Image } from "~/components/image"
import { assertContext } from "~/utils/solid/assertContext"

import { ReleaseInfoPageContext } from ".."

export function ReleaseInfoCoverImage() {
	const ctx = assertContext(ReleaseInfoPageContext)
	
	return (
		<Image.Root>
			<div class="isolate size-64 overflow-hidden rounded-lg bg-slate-100">
				<Image.Fallback>
					{(state) =>
						state !== Image.State.Ok && (
							<div class="size-full bg-slate-100 flex items-center justify-center">
								<span class="text-slate-500 text-sm">No Cover Art</span>
							</div>
						)
					}
				</Image.Fallback>
				<Image.Img
					src={ctx.release.cover_art_url ?? undefined}
					alt={ctx.release.title}
					class="size-full object-cover"
				/>
			</div>
		</Image.Root>
	)
}