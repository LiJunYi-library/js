import type { Meta, StoryObj } from '@storybook/vue3';
import { RFalls } from "@rainbow_ljy/v-view";

const meta = {
    title: 'Layout/RFalls',
    component: RFalls,
    tags: ['autodocs'],
    argTypes: {
        gap: {
            description: '间距',
            defaultValue: 10,
            control: { type: 'number' },
        },
        columns: {
            description: '列个数',
            defaultValue: 1,
            control: { type: 'number' },
        },
        minAutoWidth: {
            description: '响应式 最小宽度',
            defaultValue: 0,
            control: { type: 'number' },
        },
    },
    args: {
        gap: 10,
        columns: 1,
        minAutoWidth: 0,
    },
} satisfies Meta<typeof RFalls>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
    render: (args) => ({
        components: { RFalls },
        setup() {
            return { args };
        },
        template: `
        <RFalls  class="con"  v-bind="{...{...args,fill:false}}"  >
            <div class="con-b-box" grid-column="1" > 我我我我我我我我我我我我我我我我我我我我我我我我我我我我我我我我我我我我我我我我我我我我我我我我我我我我我我我我我我我我我我 </div>
            <div class="con-b-box" grid-column="2" >  我我我我我我我我我我我我我我我我我我我我我我我我我我我 </div>
            <div class="con-b-box" grid-column="2"  > 我我我我我我我我我我我我我我我我我我我我我我我我我我我我我我我我我我我我我我我我我我我我我我我我我我我我我我我我我我我我我我 </div>
            <div class="con-b-box"  grid-column="3" >我我我我我我我我我我我我我我我我我我我我我我我我我我我我我我我我我我我我我我我我我我我我我我我我我我我我我我我我我我我我我我我我我我我我我我我我我我我我我我我我我我我我我我我我我我我我我我我我我我我我我我我我我我我我我我我我我我我我我我我我我我我我我我我我我我我我我我我 </div>
            <div class="con-b-box" grid-column="1" > 我我我我我我我我我我我我我我我我我我我我我我我我我我我我我我我我我我我我我我我我我我我我我 </div>
            <div class="con-b-box" grid-column="1" > 我我我我我我我我我我我我我我我我我我我我我我我我我我我我我我我我我我我我我我我我我我我我我我我我我我我我我我我我我我我我我我我我我我我我我我我我我我我我我我我我我我我我我我我我我我我我我我我我我我我我我我我我我我我 </div>
            <div class="con-b-box" grid-column="1" > 我我我我我我我我我我我我我我我我我我我我我我我我我我我我我我我我我我我我我我我 </div>
        </RFalls>


    `,
    }),
};







