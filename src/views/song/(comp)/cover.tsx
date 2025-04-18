/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Image } from "../../../components/image"


export default function Cover({ src, ...rest }){
    return(
        <Image.Root {...rest}>
				<Image.Container>
					<Image.Img
						loading="lazy"
						width={rest["width"]}
						height={rest["height"]}
						src={src}
					/>
					<Image.Fallback />
					<Image.ErrorComponent />
				</Image.Container>
			</Image.Root>
    )
}