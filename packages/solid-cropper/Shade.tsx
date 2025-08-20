import "cropperjs"

export interface ShadeProps {
	x?: number
	y?: number
	width?: number
	height?: number
	slottable?: boolean
	themeColor?: string
}

export function Shade(props: ShadeProps) {
	// @ts-expect-error
	return <cropper-shade {...props} />
}
