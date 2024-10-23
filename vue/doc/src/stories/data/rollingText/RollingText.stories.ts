import type { Meta, StoryObj } from '@storybook/vue3';
import { RRollingText } from "@rainbow_ljy/v-view";

const meta = {
    title: 'Data/RRollingText',
    component: RRollingText,
    tags: ['autodocs'],
    argTypes: {
        position: {
            description: '对齐方式',
            control: 'select',
            defaultValue: 'center',
            options: [
                "",
                "vertical",
                "horizontal",
                "center",
                "top-left",
                "top-center",
                "top-right",
                "right-center",
                "right-bottom",
                "bottom-center",
                "bottom-left",
                "left-center",]
        },
        left: {
            description: 'left',
            control: { type: 'text' },
        },
        right: {
            description: 'right',
            control: { type: 'text' },
        },
        bottom: {
            description: 'bottom',
            control: { type: 'text' },
        },
        modelValue: {
            description: 'top',
            control: { type: 'number' },
        },
    },
    args: {
        modelValue: 100,
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
        <div  class="con-hv100 "  >
         <div  >
           <RRollingText class=""  v-bind="args"   ></RRollingText>
               </div>
        </div>


    `,
    }),
};







