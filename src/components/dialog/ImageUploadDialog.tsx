import { type JSX } from "solid-js"

import { Dialog } from "."
import ImageDrop from "../form/ImageCrop"

type ImageState = {
  error: string | null
  loading: boolean
  file: File
  croppedImage: string | null
}

export type ImageUploadDialogProps = {
  title: string
  open: boolean
  onOpenChange: () => void
  saveImage: (state: ImageState) => void
  trigger: JSX.Element
}

export function ImageUploadDialog(props: ImageUploadDialogProps) {
  const handleSave = (state: ImageState) => {
    props.saveImage(state)
  }

  const handleCropComplete = (state: ImageState) => {
    handleSave(state)

    props.onOpenChange()
  }

  return (
    <Dialog.Layout
      open={props.open}
      onOpenChange={props.onOpenChange}
      trigger={props.trigger}
    >
      <Dialog.Content class="w-full max-w-md p-6">
        <Dialog.Title class="text-lg font-medium">{props.title}</Dialog.Title>
        <ImageDrop
          option={{
            viewport: {
              type: "square",
            },
          }}
          onCropComplete={handleCropComplete}
        />
      </Dialog.Content>
    </Dialog.Layout>
  )
}
