import { DefineComponent } from "vue";

export declare type LoadingProps = {
    errorText: string,
    errorSrc: string,
    loadErrorText: string,
    beginText: string,
    beginSrc: string,
    loadingText: string,
    finishedText: string,
    emptySrc: string,
    emptyText: string,
    loadText: boolean | string,
    promiseHook: Object,
    loadingHook: [],
    onIntersectBottom: () => void,
    onIntersectionBottom: () => void,
    onFirstIntersectionBottom: () => void,
    onErrorClick: () => void,
    onLoadErrorClick: () => void,
    onLoadClick: () => void,
}

export declare const RLoading: DefineComponent<LoadingProps>;

export declare const RLoadingMask: DefineComponent<LoadingProps>;

export declare const RLoadingLoad: DefineComponent<LoadingProps>;

export declare function RLoadingHoc(listHook: any, props: any, context: any): any;
