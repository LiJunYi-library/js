import { DefineComponent } from "vue";

export declare const RScrollVirtualGridList: DefineComponent<{
    bothEndsHeight: Number,
    avgHeight: Number,
    keyExtractor: ({ item: any, index: number }) => any,
    columns: Number,
    gap: Number,
    listHook: Object,
    list: [],
    openAnimationFrame: Boolean,
    minAutoWidth: Number,
    onItemVisible: ({ item: any, index: number }) => any,
    onItemMarkVisible: ({ item: any, index: number }) => any,
    onItemMarkRender: ({ item: any, index: number }) => any,
}>;
