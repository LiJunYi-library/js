import { DefineComponent } from "vue";

export declare interface RGridProps {
    /**
    * 列数
    */
    columns: number;
    /**
    * 间距
    */
    gap: number | string;
    inline: boolean;
    /**
    * 响应式最小宽度
    */
    minAutoWidth: number;
    /**
    * 是否换行
    */
    wrap: boolean;
    /**
    * 是否拉伸
    */
    stretch: boolean;
}

export declare interface RGridListProps extends RGridProps {
    /**
    * 是否拉伸
    */
    listHook: Object,
    /**
    * 数据
    */
    list: [],
    /**
    * 要渲染几个子view
    */
    renderCount: number,
}

export declare const RGrid: DefineComponent<RGridProps>;

export declare const RGridList: DefineComponent<RGridListProps>;

export declare const RGridListSelect: DefineComponent<RGridListProps>;
