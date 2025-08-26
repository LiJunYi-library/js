import { FetchInstance, FetchConfig } from "@rainbow_ljy/rainbow-js";

export declare function useFetchHOC<T = any, D = any>(
  options: FetchConfig<T, D>
): <D>(props: FetchConfig<T, D>) => FetchInstance<T, D>;
