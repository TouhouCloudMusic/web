import { Image } from "~/components/image"

// TODO:
// - Image src
// - Better fallback
//
export function CoverImage() {
	return (
		<Image.Root>
			<Image.Fallback>
				{(state) =>
					state === Image.State.Error ?
						<div class="aspect-square h-full overflow-hidden rounded-md bg-slate-300"></div>
					:	<></>
				}
			</Image.Fallback>
			<Image.Img
				src="https://no"
				class="aspect-square h-full overflow-hidden rounded-md object-cover"
			/>
		</Image.Root>
	)
}
