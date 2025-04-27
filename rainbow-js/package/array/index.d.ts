export declare function arrayLoop(num: number, cb: (index: number) => boolean): void;

export declare function arrayLoops(start: number, end: number, cb: (index: number) => boolean): void;

export declare function arrayLoopMap<T>(num: number, cb: (index: number) => T): T[];

export declare function arrayBubble<T>(
  list: T[],
  formatter: (item: T, index: number, list: T[]) => unknown,
  verdict: (value: unknown, item: T, index: number, list: T[]) => boolean,
): T;

export declare function arrayBubbleMin<T>(
  list: T[],
  formatter: (item: T, index: number, list: T[]) => unknown,
): T;

export declare function arrayBubbleLastMin<T>(
  list: T[],
  formatter: (item: T, index: number, list: T[]) => unknown,
): T;

export declare function arrayBubbleMax<T>(
  list: T[],
  formatter: (item: T, index: number, list: T[]) => unknown,
): T;

export declare function arrayBubbleLastMax<T>(
  list: T[],
  formatter: (item: T, index: number, list: T[]) => unknown,
): T;

export declare function arrayRemoveIndex<T>(list: T[], num: number): T[];

/**
 * 删除数组中第一个找到的item 改变数组
 */
export declare function arrayRemove<T>(list: T[], item: T): T[];

export declare function arrayRemoveLast<T>(list: T[], item: T): T[];

export declare function arrayRemoves<T>(list: T[], item: T): T[];

export declare function arraySplitIndex<T>(list: T[], num: number): number[][];

export declare function arraySplit<T>(list: T[], num: number): T[][];

export declare function arrayWipeRepetition<T>(
  list: T[],
  formatter?: (item: T, index: number) => unknown,
): T[];

export declare function arrayWipeRepetitionLast<T>(
  list: T[],
  formatter: (item: T, index: number) => unknown,
): T[];

export declare function arrayWipeRepetitionLast<T>(
  list: T[],
  formatter: (item: T, index: number) => unknown,
): T[];

export declare function arrayExtractSame<T>(
  list: T[],
  formatter: (item: T, index: number) => unknown,
): T[];

export function arraySort<T>(
  list: T[],
  formatter: (item: T, index: number) => unknown,
  formatter2?: (item: T, index: number) => unknown,
): T[];

export declare function arrayReverseSort<T>(
  list: T[],
  formatter: (item: T, index: number) => unknown,
  formatter2?: (item: T, index: number) => unknown,
): T[];

export declare function arraySortByList<T, H>(
  list: T[],
  arr: H[],
  formatter: (item: T, ele: H) => boolean,
): T[];

export declare function arrayRandom<T>(list: T[]): T[];

export declare function arrayInvokeFuns<T>(list: T[], ...arg: unknown[]): void;

export declare function arrayInvokeFuns<T>(
  list: T[],
  formatter: (item: T) => unknown,
  ...arg: unknown[]
): void;

export declare type ArrayEvents<T> = {
  events: T[];
  push: (eventCB: void) => void;
  remove: (eventCB: void) => void;
  invoke: (...arg: unknown[]) => void;
  invokes: (callbackfn: (value: T, index: number, array: T[]) => void) => void;
};

export declare function arrayEvents<T>(): ArrayEvents<T>;

export declare function arrayBinaryFindIndex<T>(
  list: T[],
  formatter: (item: T) => boolean,
  compare: (item: T) => boolean,
): number;

export declare function arrayBinaryFind<T>(
  list: T[],
  formatter: (item: T) => boolean,
  compare: (item: T) => boolean,
): T;

export declare function arrayBinaryFindLastIndex<T>(
  list: T[],
  formatter: (item: T) => boolean,
  compare: (item: T) => boolean,
): number;

export declare function rrayBinaryFindLast<T>(
  list: T[],
  formatter: (item: T) => boolean,
  compare: (item: T) => boolean,
): T;

export declare function arrayRewriteFunction<T>(
  list: T[],
  callbackfn: (name: string, ...args: any) => void,
): T[];

export declare function arrayRewriteFunction<T>(
  list: T[],
  args: {
    onChange?: (name: string, ...args: any) => void;
    oncopyWithin?: (...args: any) => void;
    onfill?: (...args: any) => void;
    onpush?: (...args: any) => void;
    onpop?: (...args: any) => void;
    onshift?: (...args: any) => void;
    onunshift?: (...args: any) => void;
    onsplice?: (...args: any) => void;
    onsort?: (...args: any) => void;
    onreverse?: (...args: any) => void;
  },
): T[];

export declare function arrayForEachFindIndex<T>(
  list: T[],
  callbackfn: (value: T, index: number, array: T[]) => Boolean,
): number;

export declare function arrayForEachFind<T>(
  list: T[],
  callbackfn: (value: T, index: number, array: T[]) => Boolean,
): T;

export declare function arrayForcedTransform<T>(v): T[];

export class ListArray extends Array { }

// 模仿sql查询  //
export declare function WHERE(compare: any, val: any): boolean;

export declare function NOT(compare: any, val: any): boolean;

export declare function LIKE(
  compare: string | RegExp,
  val: any,
  flags?: string | undefined,
): boolean;

export declare function IN(compare: any[], val: any): boolean;

export declare function BETWEEN(compare: any[], val: any): boolean;
export declare function BETWEEN(min: any, max: any, val: any): boolean;
