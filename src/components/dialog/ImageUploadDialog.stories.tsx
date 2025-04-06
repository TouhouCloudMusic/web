import { createSignal } from "solid-js"
import { type Meta, type StoryObj } from "storybook-solidjs"
import { ImageUploadDialog } from "./ImageUploadDialog"
import { Button } from "../button"
const meta = {
  component: ImageUploadDialog,
  tags: ["autodocs"],
  argTypes: {
    title: { control: "text", description: "Dialog title" },
    isOpen: { control: "boolean", description: "Controls dialog visibility" },
    onClose: { action: "closed", description: "Called when dialog is closed" },
    saveImage: { action: "image saved", description: "Called when image is saved" },
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
        isOpen={open()}
        onClose={() => close()}
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
        isOpen={isOpen()}
        onClose={() => setIsOpen(false)}
      />
    )
  },
  args: {
    title: "Upload Banner Image",
  },
} 