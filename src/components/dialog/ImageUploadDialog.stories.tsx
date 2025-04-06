import { createSignal } from "solid-js"
import { type Meta, type StoryObj } from "storybook-solidjs"

import { Button } from "../button"
import { ImageUploadDialog } from "./ImageUploadDialog"

const meta = {
  component: ImageUploadDialog,
  tags: ["autodocs"],
  argTypes: {
    title: { control: "text", description: "Dialog title" },
    open: { control: "boolean", description: "Controls dialog visibility" },
    onOpenChange: {
      action: "closed",
      description: "Called when dialog is closed",
    },
    saveImage: {
      action: "image saved",
      description: "Called when image is saved",
    },
  },
} satisfies Meta<typeof ImageUploadDialog>

export default meta
type Story = StoryObj<typeof ImageUploadDialog>

export const Default: Story = {
  render: (args) => {
    const [open, setOpen] = createSignal(false)
    const close = () => {
      console.log("Close")
      setOpen(false)
    }

    return (
      <ImageUploadDialog
        {...args}
        trigger={<Button>Upload Image</Button>}
        open={open()}
        onOpenChange={() => close()}
        saveImage={(state) => {
          console.log("Image saved:", state)
        }}
      />
    )
  },
  args: {
    title: "Upload Profile Picture",
  },
}

export const CustomTitle: Story = {
  render: (args) => {
    const [isOpen, setIsOpen] = createSignal(false)

    return (
      <ImageUploadDialog
        {...args}
        trigger={<Button>Upload Banner Image</Button>}
        open={isOpen()}
        onOpenChange={() => setIsOpen(false)}
      />
    )
  },
  args: {
    title: "Upload Banner Image",
  },
}
