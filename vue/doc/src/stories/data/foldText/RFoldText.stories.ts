import type { Meta, StoryObj } from '@storybook/vue3';
import { RFoldText } from "@rainbow_ljy/v-view";

const meta = {
    title: 'Data/RFoldText',
    component: RFoldText,
    tags: ['autodocs'],
    argTypes: {
        text: {
            description: '文本',
            defaultValue: '',
            control: { type: 'text' },
        },
        maxLine: {
            description: '最大行数',
            defaultValue: 0,
            control: { type: 'number' },
        },
        animation: {
            description: '是否有动画',
            control: 'boolean',
            defaultValue: true
        },
        isFold: {
            description: '点击是否折叠收起',
            control: 'boolean',
            defaultValue: true
        },

    },
    args: {
        animation: true,
        isFold: true,
        maxLine: 2,
        text: '我我我我我我我我我我我我我我我我我我我我我我我我我我我我我我我我我我我我我我我我我我我我我我我我我我我我我我我我我我我我我我我我我我我我我我我我我我我我我我我我我我我我我我我我我我我我我我我我我我我我我我我我我我我我我我我我我我我我我我我我我我我我我我我我',
    },
} satisfies Meta<typeof RFoldText>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
    render: (args) => ({
        components: { RFoldText },
        setup() {
            return { args };
        },
        template: `
        <div  class="con-h100 "  >

           <RFoldText v-bind="args"   > <span>标签--</span>  </RFoldText>
             
        </div>


    `,
    }),
};







