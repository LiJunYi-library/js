import type { Meta, StoryObj } from '@storybook/vue3';
import { RColumn } from "@rainbow_ljy/v-view";

const meta = {
  title: 'Layout/RColumn',
  component: RColumn,
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
    align: '',
    reverse: false,
    wrap: false,
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
      <RColumn  class="con-hv100"  v-bind="{...{...args,fill:false}}"  >
        <div class="con-c"> 第1个 个个个个个</div>
        <RColumn class="con-c"  v-bind="args" > 第2个是嵌套 </RColumn>
        <div class="con-c"> 第3个 个个个个个</div>
        <div class="con-c"> 第4个 个个个个个</div>
      </RColumn>


    `,
  }),
};

// <RColumn  class="con-h50"  v-bind="args"  >
// <div class="con-c"> 第1个 个个个个个</div>
// <div class="con-c"> 第3个 个个个个个</div>
// <div class="con-c"> 第4个 个个个个个</div>
// <div class="con-c"> 第5个 个个个个个</div>
// <div class="con-c"> 第6个 个个个个个</div>
// <div class="con-c"> 第7个 个个个个个</div>
// <div class="con-c"> 第8个 个个个个个</div>
// </RColumn>

// export const Docs = () => ({
//   template: `
//      <RColumn  class="con-h100"  >
//         <div class="con-c"> 11111 </div>
//         <RColumn class="con-c" v-bind="args"> 22222222 </RColumn>
//         <div class="con-c"> 33 </div>
//       </RColumn>
//   `,
// });






