export declare function objectFilter(obj: object, regExp: RegExp, isDelete: boolean): object;
export declare function objectIsEmpty(obj: object): boolean;
export declare function objectEqualitys(o1: object = {}, o2: object = {}): boolean;
export declare function objectParseUri(url: string, obj: object): string;
export declare function objectParseFormData(obj: object, bool: boolean): FormData;
export declare function objectAssign(o1: object = {}, o2: object = {}, keys: string[]): object;
export declare function objectClear(obj: object): void;
export declare function objectIncludes(obj: object,key:string): boolean;
export declare function objectForIn<T>(obj: T,fmt:(item: keyof T,key:string,obj: T)=>void): void;
export declare function objectForMap<T>(obj: T,fmt:(item: keyof T,key:string,obj: T)=>object): object;

