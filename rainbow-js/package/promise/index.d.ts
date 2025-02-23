export declare function useQueue<T = any>(
  props: {
    onBegin: (queue: T[], current: T) => void;
    onFinish: (queue: T[], current: T) => void;
    onPush: (queue: T[], current: T) => void;
    onPushed: (queue: T[], current: T) => void;
    onRemove: (queue: T[], current: T) => void;
    onRemoved: (queue: T[], current: T) => void;
  } = {}
): {
  queue: T[];
  push(current: T): void;
  remove(current: T): void;
  change(current: T): void;
};


export declare function setTimeoutPromise<T = number>(t:number = 0, v:T = 0) :Promise<T>

export declare function requestAnimationFramePromise<T = any>( value?:T ) :Promise<T>

