import type { Meta, StoryObj } from '@storybook/vue3';
import {
  RRow
} from "@rainbow_ljy/v-view";

const meta = {
  title: 'Layout/RRow',
  component: RRow,
  tags: ['autodocs'],
  parameters: {
    backgrounds: {
      default: 'dark',
    },
  },
  argTypes: {
    justify: {
      description: '对齐方式',
      control: 'select',
      options: ["", "start", "end", "around", "between", "evenly", "center", "stretch"]
    },
    align: {
      description: '对齐方式',
      control: 'select',
      defaultValue: 'center',
      options: ["", "start", "end", "center", "stretch", "baseline"]
    },
    gap: {
      description: '间距',
      defaultValue: 10,
      control: { type: 'number' },
    },
    reverse: {
      description: '是否颠倒排序',
      defaultValue: false,
      control: { type: 'boolean' },
    },
    wrap: {
      description: '是否换行',
      defaultValue: false,
      control: { type: 'boolean' },
    },
    // fill
    auto: {
      table: {
        category: '只针对嵌套的有效',
      },
      description: '自己的 对齐方式',
      control: 'select',
      options: ["", "top", "bottom", "left", "right", "center", "horizontal", "vertical"],
    },
    fill: {
      table: {
        category: '只针对嵌套的有效',
      },
      description: '填充样式',
      control: 'select',
      options: ["", "false", "true", "vertical", 'horizontal'],
    },
    alignSelf: {
      table: {
        category: '只针对嵌套的有效',
      },
      description: '自己的 对齐方式',
      control: 'select',
      options: ["", "start", "end", "center", "stretch", "baseline",]
    },

  },
  args: {
    gap: 10,
    align: 'center',
    reverse: false,
    wrap: false,
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
      <RRow  class="con-h50"  v-bind="{...{...args,fill:false}}"  >
        <div class="con-c"> 第1个 个个个个个</div>
        <RRow class="con-c"  v-bind="args" > 第2个是嵌套 </RRow>
        <div class="con-c"> 第3个 个个个个个</div>
        <div class="con-c"> 第4个 个个个个个</div>
      </RRow>


    `,
  }),
};

// <RRow  class="con-h50"  v-bind="args"  >
// <div class="con-c"> 第1个 个个个个个</div>
// <div class="con-c"> 第3个 个个个个个</div>
// <div class="con-c"> 第4个 个个个个个</div>
// <div class="con-c"> 第5个 个个个个个</div>
// <div class="con-c"> 第6个 个个个个个</div>
// <div class="con-c"> 第7个 个个个个个</div>
// <div class="con-c"> 第8个 个个个个个</div>
// </RRow>

// export const Docs = () => ({
//   template: `
//      <RRow  class="con-h100"  >
//         <div class="con-c"> 11111 </div>
//         <RRow class="con-c" v-bind="args"> 22222222 </RRow>
//         <div class="con-c"> 33 </div>
//       </RRow>
//   `,
// });






