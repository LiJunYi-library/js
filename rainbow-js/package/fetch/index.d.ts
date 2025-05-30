type ANY = any;
type FunReturnVal = () => ANY;

export declare interface FetchConfig<T = ANY, D = ANY> extends RequestInit {
  url?: string;
  urlParams?: ANY;
  body?: ANY;
  baseUrl?: string ;
  time?: number ;
  isDownloadFile?: boolean ;
  fileName?: string;
  isFormBody?: boolean;
  isJsonBody?: boolean;
  loading?: boolean ;
  begin?: boolean ;
  error?: boolean ;
  data?: ANY;
  errorData?: ANY;

  formatterResponse?: (res: Response, config: this) => Promise<ANY>;
  formatterData?: (data: D, rest: T, res: Response, config: this) => ANY;
  formatterFile?: (res: Response, config: this) => Promise<File>;
  formatterFileName?: (res: Response, config: this) => Promise<string>;
  formatterBody?: (config: this) => Promise<undefined | object>;
  parseBody?: (config: this) => Promise<string>;
  formatterUrlParams?: (config: this) => Promise<undefined | object>;
  downloadFile?: (res: Response, config: this, file: File) => void;
  interceptResponseSuccess?: (res: Response, rest: T, config: this) => Promise<D>;
  interceptResponseError?: (error: ANY, config: this, resolve: (value: any) => void, reject: (value: any) => void) => void;
  interceptRequest?: (config: this) => void;
  onAbort?: (error: ANY, config: this, resolve: (value: any) => void, reject: (value: any) => void) => void;
  onTimeoutAbort?: (error: ANY, config: this, resolve: (value: any) => void, reject: (value: any) => void) => void;
  onLoading?: (error: ANY, config: this, resolve: (value: any) => void, reject: (value: any) => void) => void;
  onRequest?: (config: this) => ANY;
  onResponse?: (config: this) => ANY;
}


export class Fetch<T = any, D = any> {
  loading: Boolean;
  begin: Boolean;
  error: Boolean;
  data: D;
  errorData: any;
  config: FetchConfig<T, D>;
  send: (config: FetchConfig<T, D>) => Promise<D>;
  nextSend: (config: FetchConfig<T, D>) => Promise<D>;
  awaitSend: (config: FetchConfig<T, D>) => Promise<D>;
  beginSend: (config: FetchConfig<T, D>) => Promise<D>;
  nextBeginSend: (config: FetchConfig<T, D>) => Promise<D>;
  awaitBeginSend: (config: FetchConfig<T, D>) => Promise<D>;
  abortPrve: () => void;
  abort: () => void;
  constructor(props?: FetchConfig<T, D> )
}

export declare function fetchHOC(props:any):any
