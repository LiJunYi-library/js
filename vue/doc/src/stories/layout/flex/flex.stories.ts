import type { Meta, StoryObj } from '@storybook/vue3';
import { RRow, RColumn } from "@rainbow_ljy/v-view";



export default {
  title: 'Examples/RRowAndRColumn',
  component: RRow,
  argTypes: {
    // 配置 RRow 的 argTypes
    customClass: {
      name: 'Custom Class',
      description: 'Custom class to apply to the row.',
      table: {
        category: 'RRow Props',
        defaultValue: { summary: '' },
        type: { summary: 'string' },
      },
      control: { type: 'text' },
    },

    text: {
      name: 'text',
      description: 'text to apply to the row.',
      table: {
        category: 'RRow Props',
        defaultValue: { summary: '' },
        type: { summary: 'string' },
      },
      control: { type: 'text' },
    },
  },
} as Meta<typeof RRow>;

const Template: StoryObj<typeof RRow> = (props: any) => ({
  components: { RRow, RColumn },
  setup() {
    return { args: props };
  },
  template: `
    <RRow :custom-class="args.customClass">
      <div class="con-c"> 11111 </div>
      <RColumn :content="args.content" :custom-class="args.customClass" />
    </RRow>
  `,
});

export const Default = Template.bind({});

Default.args = {
  customClass: '',
  content: 'Content here',
};

// 配置 RColumn 的 argTypes
const ColumnArgTypes = {
  content: {
    name: 'Content',
    description: 'Content to display in the column.',
    table: {
      category: 'RColumn Props',
      defaultValue: { summary: 'Content here' },
      type: { summary: 'string' },
    },
    control: { type: 'text' },
  },
  customClass: {
    name: 'Custom Class',
    description: 'Custom class to apply to the column.',
    table: {
      category: 'RColumn Props',
      defaultValue: { summary: '' },
      type: { summary: 'string' },
    },
    control: { type: 'text' },
  },
};

Default.argTypes = {
  ...Default.argTypes,
  ...ColumnArgTypes,
};
