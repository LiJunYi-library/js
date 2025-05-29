import { ReactiveEffect, UnwrapNestedRefs, Ref } from "vue";
import { PromiseHooks, AsyncFun, PromiseConfig } from "../promise";
import { Radio, SelectProps } from './radio'


export declare function useRadio(options: any): any; // todo
export declare function useAsyncRadio(options: any): any; // todo
export declare function useMultiple(options: any): any; // todo
export declare function useAsyncMultiple(options: any): any; // todo
export declare function useSelect(options: any): any; // todo
export declare function useAsyncSelect(options: any): any; // todo

export declare function useRadio2<T>(options: SelectProps<T>): Radio<T>; // use
export declare function useRadio3(options: any): any; // use
export declare function useAsyncRadio2(options: any): any; // use
export declare function useMultiple2(options: any): any; // use
export declare function useAsyncMultiple2(options: any): any; // use
export declare function useSelect2(options: any): any; // use
export declare function useAsyncSelect2(options: any): any; // use

export declare function usePagination(options: any): any; // todo
export declare function usePaginationSelect(options: any): any; // todo
export declare function useListPagination(options: any): any; // todo
export declare function useAsyncPagination(options: any): any; // todo
export declare function useAsyncPaginationSelect(options: any): any; // todo
export declare function useAsyncListPagination(options: any): any; // todo
export declare function useFetchPagination(options: any): any; // todo

export declare function useFetchPagination2(options: any): any; // use

export declare function useList(options: any): any; // use
export declare function useAsyncList(options: any): any; // use
export declare function useAsyncListSelect(options: any): any; // use
export declare function useListLoad2(options: any): any; // use
export declare function useListLoadSelect(options: any): any; // use
export declare function useListLoad(options: any): any; // todo
export declare function useAsyncListLoad(options: any): any; // todo

/**
 *
 *
 *
 *
 */
export declare type FetchListHooks = PromiseHooks & {
  list: any[];
  begin: boolean;
  fetch: AsyncFun;
};
export declare type FetchListConfig = PromiseConfig & {
  fetchCB?: AsyncFun;
  formatterList?: (hooks: FetchListHooks) => any[];
};
export declare function getFetchListConfig(options: FetchListConfig): FetchListConfig;
export declare function useFetchList(options: FetchListConfig): FetchListHooks;

/**
 *
 */
export declare type PaginationListHooks = FetchListHooks & {
  currentPage: number;
  pageSize: number;
  total: number;
  finished: boolean;
  currentSize: number;
  resolve: (accumulation: boolean) => void;
  beginning: AsyncFun;
  concat: AsyncFun;
  replace: AsyncFun;
  reset: AsyncFun;
  fetch: AsyncFun;
};
export declare type PaginationListConfig = FetchListConfig & {
  _super?: FetchListConfig;
  formatterTotal?: (PaginationListHooks) => number;
  formatterFinished?: (PaginationListHooks) => boolean;
  formatterCurrentPage?: (PaginationListHooks) => number;
  formatterList?: (PaginationListHooks) => any[];
  serverPaging?: boolean;
  currentPage?: number;
  pageSize?: number;
  total?: number;
};
export declare function getPaginationConfig(options: PaginationListConfig): PaginationListConfig;
export declare function usePaginationList(options: PaginationListConfig): PaginationListHooks;
/**
 *
 *
 */
export declare type TablePaginationHooks = PaginationListHooks & {
  onPageChange: (currentPage: number, pageSize: number) => void;
};
export declare function useTablePagination(options: PaginationListConfig): TablePaginationHooks;

export * from "./list-load";
export * from "./list/index";
export * from "./load/index";
export * from "./multiple/index";
export * from "./pagination/index";
export * from "./radio/index";
export * from "./select/index";

