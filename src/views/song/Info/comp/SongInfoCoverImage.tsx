/* @refresh skip */
import { Image } from "~/components/image"
import { assertContext } from "~/utils/context"

import { SongInfoPageContext } from ".."

// TODO:
// - Image src
// - Better fallback
//
export function SongInfoCoverImage() {
	const context = assertContext(SongInfoPageContext)
	return (
		<Image.Root>
			<div class="isolate size-64">
				<Image.Fallback>
					{(state) =>
						state != Image.State.Ok && (
							<div class="size-full bg-slate-100"></div>
						)
					}
				</Image.Fallback>
				<Image.Img
					src={context.song.releases?.[0]?.cover_art_url ?? undefined}
					class="size-full"
				/>
			</div>
		</Image.Root>
	)
}
