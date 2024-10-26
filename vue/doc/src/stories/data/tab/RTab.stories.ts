import type { Meta, StoryObj } from '@storybook/vue3';
import { RTab } from "@rainbow_ljy/v-view";
import { useRadio2 } from "@rainbow_ljy/v-hooks";
import { arrayLoopMap } from "@rainbow_ljy/rainbow-js";
import { ref, watch } from 'vue';
import Demo from './demo.vue'



const meta: Meta<typeof RTab> = {
  title: 'Components/RTab', // 故事的标题
  component: RTab,
  argTypes: {
    listHook: {
      description: 'listHook',
      control: 'inline-check',
    },
    listHookIndex: {
      description: '更改 listHook 的index 调用listHook.updateIndex()方法',
      defaultValue: 0,
      control: { type: 'number' },
    },
  },
  args: {
    listHookIndex: 0,
    listHook: useRadio2({ list: Array.from({ length: 10 }, (_, i) => ({ value: `value${i}`, label: `lab${i}` })) }),
    animation: true,
    isFold: true,
    maxLine: 2,
    text: '我我我我我我',
  },
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args) => ({
    components: { RTab },
    setup() {
      const { listHook, listHookIndex, ...otherArgs } = args;

      // 将 listHookIndex 转换为 ref，以便使用 watch
      const listHookIndexRef = ref(listHookIndex);

      // 监听 listHookIndex 的变化
      watch(listHookIndexRef, (newIndex) => {
        listHook.updateIndex(newIndex);
      });

      // 初始化时调用一次 updateIndex
      listHook.updateIndex(listHookIndex);

      return { ...otherArgs, listHook, listHookIndex: listHookIndexRef };
    },
    template: `
      <div class="con-h100">
        <RTab v-bind="otherArgs" :listHook="listHook">
          <span>默认插槽内容</span>
          <template #default="{ item, index }">
            <span>具名插槽内容 - {{ item.label }} (索引: {{ index }})</span>
          </template>
        </RTab>
      </div>
    `,
  }),
};