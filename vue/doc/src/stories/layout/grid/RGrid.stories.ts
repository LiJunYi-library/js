import type { Meta, StoryObj } from '@storybook/vue3';
import { RGrid } from "@rainbow_ljy/v-view";

const meta = {
  title: 'Layout/RGrid',
  component: RGrid,
  tags: ['autodocs'],
  parameters: {
    backgrounds: {
      default: 'dark',
    },
  },
  argTypes: {
    gap: {
      description: '间距',
      defaultValue: 10,
      control: { type: 'number' },
    },
    columns: {
      description: '列个数',
      defaultValue: 1,
      control: { type: 'number' },
    },
    minAutoWidth: {
      description: '响应式 最小宽度',
      defaultValue: 0,
      control: { type: 'number' },
    },
    wrap: {
      description: '是否换行',
      defaultValue: false,
      control: { type: 'boolean' },
    },
    stretch: {
      description: '是否换行',
      defaultValue: false,
      control: { type: 'boolean' },
    },
  },
  args: {
    gap: 10,
    columns: 1,
    minAutoWidth: 0,
    wrap: false,
    stretch: false,

  },
} satisfies Meta<typeof RGrid>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args) => ({
    components: { RGrid },
    setup() {
      return { args };
    },
    template: `
      <RGrid  class="con"  v-bind="{...{...args,fill:false}}"  >
        <div class="con-c" grid-column="1" > grid-column=1 </div>
        <div class="con-c" grid-column="2" >  grid-column=2 </div>
        <div class="con-c" grid-column="2"  >  grid-column=2 </div>
        <div class="con-c"  grid-column="3" >  grid-column=3 </div>
          <div class="con-c" grid-column="1" > grid-column=1 </div>
            <div class="con-c" grid-column="1" > grid-column=1 </div>
              <div class="con-c" grid-column="1" > grid-column=1 </div>
      </RGrid>


    `,
  }),
};








