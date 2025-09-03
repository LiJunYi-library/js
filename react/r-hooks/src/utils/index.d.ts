import { ReactNode } from "react";

export interface RefObject<T> {
    __v_isRef: true;
    value: T;
    toRef: (value: T) => RefObject<T>;
}

export function ref<T>(state: T): RefObject<T>;

export interface MemoRefObject<T> {
    value: T | undefined;
    toRef: (value: T) => RefObject<T>;
}

export function useMemoRef<T>(): MemoRefObject<T>;

export function useOneceMemo<T>(cb: () => T): T;

export function renderSlot(
    slots: Record<string, ReactNode | ((props: any) => ReactNode)> | undefined,
    name: string,
    props?: any,
    defNode?: ReactNode | ((props: any) => ReactNode)
): ReactNode;