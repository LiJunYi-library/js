import type { Meta, StoryObj } from '@storybook/vue3';
import { RRollingText } from "@rainbow_ljy/v-view";

const meta = {
    title: 'Data/RRollingText',
    component: RRollingText,
    tags: ['autodocs'],
    argTypes: {
        isFloor: {
            description: '计算时是否Math.floor 适用于水表 ',
            defaultValue: true,
            control: { type: 'boolean' },
        },
        transition: {
            description: '等同 css 的 transition',
            defaultValue: '0.8s',
            control: { type: 'text' },
        },
        initialAnimation: {
            description: '初始化的时候是否触发动画',
            defaultValue: true,
            control: { type: 'boolean' },
        },
        initAnimation: {
            description: '当位数发生变化的时候是否触发动画',
            defaultValue: false,
            control: { type: 'boolean' },
        },
        modelValue: {
            description: 'top',
            control: { type: 'number' },
        },
    },
    args: {
        initialAnimation: true,
        initAnimation: false,
        transition: '0.8s',
        isFloor: true,
        modelValue: 0,
    },
} satisfies Meta<typeof RRollingText>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
    render: (args) => ({
        components: { RRollingText },
        setup() {
            return { args };
        },
        template: `
        <div  class="con-h30 "  >
         <div  >
           <RRollingText v-bind="args"   ></RRollingText>
               </div>
        </div>


    `,
    }),
};







