import { createSignal } from "solid-js"
import { type Meta, type StoryObj } from "storybook-solidjs"
import { logImage } from "~/utils/log"

import { Dialog } from "."
import { Button } from "../button"
import { ImageUploadDialog } from "./ImageUploadDialog"

const meta = {
  component: ImageUploadDialog,
  tags: ["autodocs"],
  argTypes: {
    title: { control: "text", description: "The display title of the dialog" },
    open: {
      control: "boolean",
      description: "The open state of the dialog",
    },

    onImageSave: {
      action: "image saved",
      description: "The callback when the image is saved",
    },
  },
} satisfies Meta<typeof ImageUploadDialog>

export default meta
type Story = StoryObj<typeof ImageUploadDialog>

export const Default: Story = {
  render: (args) => {
    const [open, setOpen] = createSignal(false)

    return (
      <ImageUploadDialog
        {...args}
        trigger={
          <Dialog.Trigger
            as={Button}
            onClick={() => setOpen(true)}
          >
            Upload Image
          </Dialog.Trigger>
        }
        open={open()}
        onImageSave={(base64) => {
          logImage(base64)
        }}
      />
    )
  },
  args: {
    title: "Upload Avatar",
  },
}

export const CustomTitle: Story = {
  render: (args) => {
    return (
      <ImageUploadDialog
        {...args}
        trigger={<Button>Upload Banner Image</Button>}
      />
    )
  },
  args: {
    title: "Upload Banner Image",
  },
}
