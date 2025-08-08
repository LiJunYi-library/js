declare type Addimpl = {
  (fun: () => void): any;
  (type: string, fun: (arg: any) => void): any;
  (type: string[], fun: (...arg: any) => void): any;
};

declare type OverloadCB = (addimpl: Addimpl) => void;

export declare function createOverload(
  overloadCB: OverloadCB,
  verifyObjectType = true
): (...arg: any) => any;

export declare function isFunction(val: any): boolean;
