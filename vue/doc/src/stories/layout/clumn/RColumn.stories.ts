import type { Meta, StoryObj } from '@storybook/vue3';
import { fn } from '@storybook/test';
import {
  RColumn
} from "@rainbow_ljy/v-view";

const meta = {
  title: 'Layout/RColumn',
  component: RColumn,
  tags: ['autodocs'],
  argTypes: {
    justify: {
      description: '对齐方式',
      control: 'select',
      options: ["start", "end", "around", "between", "evenly", "center", "stretch", ""]
    },
    align: {
      control: 'select',
      options: ["start", "end", "center", "stretch", "baseline", ""]
    },
    auto: {
      control: 'select',
      options: ["top", "bottom", "left", "right", "center", "", "horizontal", "vertical"],
    },
    alignSelf: {
      control: 'select',
      options: ["start", "end", "center", "stretch", "baseline", ""]
    },

  },
  args: {

  },
} satisfies Meta<typeof RColumn>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args) => ({
    components: { RColumn },
    setup() {
      return { args };
    },
    template: `
      <RColumn  class="con-h100">
        <div class="con-c"> 11111 </div>
        <RColumn class="con-c"  v-bind="args" > 22222222 </RColumn>
        <div class="con-c"> 33 </div>
      </RColumn>
    `,
  }),
};

// export const ListTemplate: Story = {
//   render: (args) => ({
//     components: { RColumn },
//     setup() {
//       return { args };
//     },
//     template: `
//       <RColumn class="con-h100">
//         <RColumn class="con-c"> 11111333 </RColumn>
//         <RColumn class="con-c"  v-bind="args"> 22222222 </RColumn>
//         <RColumn class="con-c"> 33 </RColumn>
//       </RColumn>
//     `,
//   }),
// };






