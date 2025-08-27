
type ANY = any;

export declare interface FetchConfig<T = ANY, D = ANY> extends RequestInit {
  url?: string;
  urlParams?: ANY;
  body?: ANY;
  baseUrl?: string;
  time?: number;
  isDownloadFile?: boolean;
  fileName?: string;
  isFormBody?: boolean;
  isJsonBody?: boolean;
  loading?: boolean;
  begin?: boolean;
  error?: boolean;
  data?: ANY;
  errorData?: ANY;

  formatterResponse?: (res: Response, config: this) => Promise<ANY>;
  formatterData?: (data: D, rawData: T, res: Response, config: this) => ANY;
  formatterFile?: (res: Response, config: this) => Promise<File>;
  formatterFileName?: (res: Response, config: this) => Promise<string>;
  formatterBody?: (config: this) => Promise<undefined | object>;
  parseBody?: (config: this) => Promise<string>;
  formatterUrlParams?: (config: this) => Promise<undefined | object>;
  downloadFile?: (res: Response, config: this, file: File) => void;
  interceptResponseSuccess?: (res: Response, rawData: T, config: this) => D | Promise<D>;
  interceptResponseError?: (
    error: ANY,
    config: this,
    resolve: (value: D) => void,
    reject: (reason: ANY) => void,
  ) => void;
  interceptRequest?: (config: this) => void;
  onAbort?: (
    error: ANY,
    config: this,
    resolve: (value: D) => void,
    reject: (reason: ANY) => void,
  ) => void;
  onTimeoutAbort?: (
    error: ANY,
    config: this,
    resolve: (value: D) => void,
    reject: (reason: ANY) => void,
  ) => void;
  onLoading?: (
    error: ANY,
    config: this,
    resolve: (value: D) => void,
    reject: (reason: ANY) => void,
  ) => void;
  onRequest?: (config: this) => void;
  onResponse?: (config: this) => void;

  [key: string]: any;
}

export declare type FetchInstance<T = unknown, D = unknown> = {
  loading: boolean;
  begin: boolean;
  error: boolean;
  data: D | undefined;
  errorData: ANY;
  // getConfig?: () => FetchConfig<T, D>; // 可选：如果需要暴露当前配置
  send: (config?: FetchConfig<T, D>) => Promise<D>;
  nextSend: (config?: FetchConfig<T, D>) => Promise<D>;
  awaitSend: (config?: FetchConfig<T, D>) => Promise<D>;
  beginSend: (config?: FetchConfig<T, D>) => Promise<D>;
  nextBeginSend: (config?: FetchConfig<T, D>) => Promise<D>;
  awaitBeginSend: (config?: FetchConfig<T, D>) => Promise<D>;
  abort: () => void;
};

export declare function fetchHOC<T = unknown, D = unknown>(
  defaultConfig?: FetchConfig<T, D>
): (customConfig?: FetchConfig<T, D>) => FetchInstance<T, D>;
