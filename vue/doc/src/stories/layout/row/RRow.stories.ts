import type { Meta, StoryObj } from '@storybook/vue3';
import { fn } from '@storybook/test';
import {
  RRow
} from "@rainbow_ljy/v-view";

const meta = {
  title: 'Layout/RRow',
  component: RRow,
  tags: ['autodocs'],
  argTypes: {
    justify: {
      description: '对齐方式',
      control: 'select',
      options: ["", "start", "end", "around", "between", "evenly", "center", "stretch"]
    },
    align: {
      description: '对齐方式',
      control: 'select',
      options: ["", "start", "end", "center", "stretch", "baseline"]
    },
    auto: {
      description: '自己的 对齐方式',
      control: 'select',
      options: ["", "top", "bottom", "left", "right", "center", "horizontal", "vertical"],
    },
    alignSelf: {
      description: '自己的 对齐方式',
      control: 'select',
      options: ["", "start", "end", "center", "stretch", "baseline",]
    },

  },
  args: {

  },
} satisfies Meta<typeof RRow>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args) => ({
    components: { RRow },
    setup() {
      return { args };
    },
    template: `
      <RRow  class="con-h100"  v-bind="args"  >
        <div class="con-c"> 11111 </div>
        <RRow class="con-c"  :auto="args.auto" > 22222222 </RRow>
        <div class="con-c"> 33 </div>
      </RRow>
    `,
  }),
};

// export const Docs = () => ({
//   template: `
//      <RRow  class="con-h100"  >
//         <div class="con-c"> 11111 </div>
//         <RRow class="con-c" v-bind="args"> 22222222 </RRow>
//         <div class="con-c"> 33 </div>
//       </RRow>
//   `,
// });






