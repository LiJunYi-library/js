import type { Meta, StoryObj } from '@storybook/vue3';
import { RAbsolute } from "@rainbow_ljy/v-view";

const meta = {
    title: 'Layout/RAbsolute',
    component: RAbsolute,
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
            defaultValue: 0,
            control: { type: 'number' },
        },
        right: {
            description: 'right',
            defaultValue: 0,
            control: { type: 'number' },
        },
        bottom: {
            description: 'bottom',
            defaultValue: 0,
            control: { type: 'number' },
        },
        top: {
            description: 'top',
            defaultValue: 0,
            control: { type: 'number' },
        },
    },
    args: {
        position: '',
        left: '',
        right: '',
        bottom: '',
        top: '',
    },
} satisfies Meta<typeof RAbsolute>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
    render: (args) => ({
        components: { RAbsolute },
        setup() {
            return { args };
        },
        template: `
        <div  class="con-hv100 relative"  >
           <RAbsolute class="con-b-box"  v-bind="args"  >  我我我我我我我我我我我我我我我我我我我我我我我我我我我 </RAbsolute>
        </div>


    `,
    }),
};







