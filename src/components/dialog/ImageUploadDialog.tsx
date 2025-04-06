import { Dialog } from "."
import ImageDrop from "../form/ImageCrop"
import { type JSX } from "solid-js"

interface ImageState {
  error: string | null
  loading: boolean
  file: File
  croppedImage: string | null
}

export interface ImageUploadDialogProps {
  title: string
  isOpen: boolean
  onClose: () => void
  saveImage: (state: ImageState) => void
  trigger: JSX.Element
}

export function ImageUploadDialog(props: ImageUploadDialogProps) {
  const handleSave = (state: ImageState) => {
    props.saveImage(state);
  };

  const handleCropComplete = (state: ImageState) => {
    handleSave(state);
    props.onClose();
  };

  return (
    <Dialog.Layout
      open={props.isOpen}
      onOpenChange={props.onClose}
      trigger={props.trigger}
    >
      <Dialog.Content class="w-full max-w-md p-6">
        <Dialog.Title class="text-lg font-medium">{props.title}</Dialog.Title>
        <ImageDrop
          aspectRatioWidth={1}
          aspectRatioHeight={1}
          onCropComplete={handleCropComplete}
        />
      </Dialog.Content>
    </Dialog.Layout>
  )
} 