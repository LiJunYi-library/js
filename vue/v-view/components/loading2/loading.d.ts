import { DefineComponent } from "vue";

export declare type LoadingProps = {
    /**
     * 出错时的文案 有值时才会显示 默认值：出错了
     */
    errorText: string,
    /**
     * 出错时的图片路径 有值时才会显示 有默认值
     */
    errorSrc: string,
    /**
     * 加载出错时的文案 有值时才会显示 默认值：加载出错了 请点击继续
     */
    loadErrorText: string,
    /**
     * 初始加载时的文案 有值时才会显示 默认值：正在加载中...
     */
    beginText: string,
    /**
     * 初始加载时的图片 已删除
     */
    beginSrc: string,
    /**
     * 加载时的文案 有值时才会显示 默认值：正在加载中
     */
    loadingText: string,
    /**
     * 结束加载时的文案 有值时才会显示 默认值：没有更多了
     */
    finishedText: string,
    /**
     * 空状态时的图片 有默认值
     */
    emptySrc: string,
    /**
     * 空状态时的文案 默认值：暂无相关数据，试试其他条件吧
     */
    emptyText: string,
    /**
     * 点击加载的文案 当为true和有值时才会显示 默认值：false
     */
    loadText: boolean | string,
    /**
     * 产生异步的Hook
     */
    promiseHook: Object,
    /**
     * 产生loading的Hook
     */
    loadingHook: [],
    /**
     * 当内容出现在底部时 每次都调用
     */
    onIntersectBottom: () => void,
    /**
     * 当内容出现在底部时 除第一次外
     */
    onIntersectionBottom: () => void,
    /**
     * 当内容出现在底部时 第一次
     */
    onFirstIntersectionBottom: () => void,
    /**
     * 当出错时点击
     */
    onErrorClick: () => void,
    /**
     * 当加载出错时点击
     */
    onLoadErrorClick: () => void,
    /**
     * 当加载时点击
     */
    onLoadClick: () => void,
}

export declare const RLoading: DefineComponent<LoadingProps>;

export declare const RLoadingMask: DefineComponent<LoadingProps>;

export declare const RLoadingLoad: DefineComponent<LoadingProps>;

export declare function RLoadingHoc(listHook: any, props: any, context: any): any;
