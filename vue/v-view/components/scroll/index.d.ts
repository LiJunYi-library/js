import { DefineComponent } from "vue";

export declare const RScroll: DefineComponent<any>;

export declare const RScrollSticky: DefineComponent<any>;

export declare const RScrollFlotage: DefineComponent<any>;

export declare const RScrollFold: DefineComponent<any>;

export declare const RScrollList: DefineComponent<any>;

export declare const RScrollVirtualList: DefineComponent<any>;

export declare const RScrollVirtualList2: DefineComponent<any>;

export declare const RVirtualScrollList: DefineComponent<any>;

export class ScrollController {
  onScroll: void;
  onFlotage: void;
  events: any[];
  scrollAllTop: (top: number) => void;
}

export * from "./scroll-page";
export * from "./message";
export * from "./top";
export * from "./fixed";
export * from "./refresh";
export * from "./memoryBubble";