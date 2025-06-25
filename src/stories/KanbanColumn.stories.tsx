import KanbanColumn from "@/components/board/KanbanColumn";
import { Meta, StoryObj } from "@storybook/nextjs-vite";

const meta: Meta<typeof KanbanColumn> = {
  title: 'Kanban/Column',
  component: KanbanColumn,
  tags: ['autodocs']
}
export default meta

type Story = StoryObj<typeof KanbanColumn>

export const 카드있는열: Story = {
  args: {
    columnId: "todo",
    items: [
      { id: '1', title: '할 일 1' },
      { id: '2', title: '할 일 2' },
    ],
    onAdd: () => {}
  },
}

export const 빈열: Story = {
  args: {
    columnId: "done",
    items: [
    ],
    onAdd: () => {}
  },
}