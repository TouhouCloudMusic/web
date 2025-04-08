import { type Meta, type StoryObj } from "storybook-solidjs"
import { Button } from "~/components/button"
import Popover from "."

const meta = {
  component: Popover.Layout,
  tags: ["autodocs"],
  argTypes: {
    title: { control: "text", description: "The Popover Title" },
    description: { control: "text", description: "The Popover Description" },
  },
} satisfies Meta<typeof Popover.Layout>

export default meta
type Story = StoryObj<typeof Popover.Layout>

export const Default: Story = {
  render: (args) => {
    return (
      <Popover.Layout {...args} trigger={<Button>Open Popover</Button>}>
        <Popover.Content>
          <Popover.Title>Popover Title</Popover.Title>
          <Popover.Description>This is a description of the popover content.</Popover.Description>
          <Popover.CloseButton>Close</Popover.CloseButton>
        </Popover.Content>
      </Popover.Layout>
    )
  },
  args: {
    title: "Popover Title",
    description: "This is a description of the popover content.",
  },
}

export const CustomContent: Story = {
  render: (args) => {
    return (
      <Popover.Layout {...args} trigger={<Button>Open Custom Content</Button>}>
        <Popover.Content>
          <div class="mt-2 space-y-2">
            <p>This is a custom content layout.</p>
            <div class="flex gap-2">
              <Button variant="Secondary">Action 1</Button>
              <Button variant="Secondary">Action 2</Button>
            </div>
          </div>
          <Popover.CloseButton class="mt-4">Close</Popover.CloseButton>
        </Popover.Content>
      </Popover.Layout>
    )
  },
  args: {
    title: "Custom Content"
  },
} 