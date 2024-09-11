declare type ResizeObserverEntry = any;
declare type ResizeObserver = any;

export declare type R_resizeObserverProps = {
  isOnce?: boolean;
  isMerge?: boolean;
  mergeTime?: number;
};

export declare type R_resizeObserverCallback = (
  entries: ResizeObserverEntry[],
  observer: ResizeObserver
) => void;

export declare function r_resizeObserver(
  htmlNode: HTMLElement | undefined,
  callBack: R_resizeObserverCallback,
  props?: R_resizeObserverProps
): ResizeObserver;

export declare function r_onceResizeObserver(
  htmlNode: HTMLElement | undefined,
  callBack: R_resizeObserverCallback,
  props?: R_resizeObserverProps
): ResizeObserver;

export declare function r_mergeResizeObserver(
  htmlNode: HTMLElement | undefined,
  callBack: R_resizeObserverCallback,
  props?: R_resizeObserverProps
): ResizeObserver;

export declare function imgParseBlob(
  img: HTMLImageElement,
  type: string
): Promise<Blob>;

export declare function downloadFile(blob: Blob, fileName: string): void;

export declare function downloadForImgHtml(
  img: HTMLImageElement,
  type: string,
  fileName: string
): void;
