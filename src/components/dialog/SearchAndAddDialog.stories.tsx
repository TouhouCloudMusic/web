import { createSignal } from "solid-js";
import { type Meta, type StoryObj } from "storybook-solidjs";
import { SearchAndAddDialog } from "./SearchAndAddDialog";

const meta = {
  component: SearchAndAddDialog,
  tags: ["autodocs"],
  argTypes: {
    title: { control: "text", description: "Dialog title" },
    data: { control: "object", description: "Data to display in the list" },
    onSubmit: { action: "submitted", description: "Submit callback" },
    listItem: { description: "Function to render list item" },
  },
} satisfies Meta<typeof SearchAndAddDialog>;

export default meta;
type Story = StoryObj<typeof SearchAndAddDialog>;

// 示例
export const Default: Story = {
  render: (args) => {
    const [open] = createSignal(false);
    const listItem = (props: { data: { name: string } }) => <div>{props.data.name}</div>;

    return (
      <>
        <SearchAndAddDialog
          {...args}
          listItem={listItem}
          defaultOpen={open()}
          onSubmit={() => {
            console.log("Submitted")
            open()
          }}
        />
      </>
    );
  },
  args: {
    title: "添加物品",
    data: [{ name: "Item 1" }, { name: "Item 2" }]
  },
}; 