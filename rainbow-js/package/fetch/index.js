import { arrayEvents } from "../array";
import { objectParseFormData, objectParseUri } from "../object";

const errLoading = { error: "loading", message: "loading", code: 41, status: 41 };
const errTimeout = { error: "Request Timeout", message: "Request Timeout", code: 48, status: 48 };
const errAbout = { error: "about", message: "about", code: 20, status: 20 };

function mergePropertys(...args) {
  const headersArr = args.map((el) => el?.headers);
  const headers = JSON.parse(JSON.stringify(Object.assign({}, ...headersArr)));
  return { headers };
}

function merge(...args) {
  return Object.assign({}, ...args, mergePropertys(...args));
}

export class Fetch {
  ___ = {
    loading: false,
    begin: false,
    error: false,
    data: undefined,
    errorData: undefined,
  };

  get loading() {
    return this.___.loading;
  }

  set loading(v) {
    this.___.loading = v;
  }

  get begin() {
    return this.___.begin;
  }

  set begin(v) {
    this.___.begin = v;
  }

  get error() {
    return this.___.error;
  }

  set error(v) {
    this.___.error = v;
  }

  get data() {
    return this.___.data;
  }

  set data(v) {
    this.___.data = v;
  }

  get errorData() {
    return this.___.errorData;
  }

  set errorData(v) {
    this.___.errorData = v;
  }

  config = {
    formatterResponse: async (res, config) => {
      const contentType = res.headers.get("Content-Type");
      if (contentType.includes("application/json")) return await res.json();
      if (contentType.includes("application/octet-stream")) {
        if (config.formatterFile) return await config.formatterFile(res, config);
        return await res.blob();
      }
      if (contentType.includes("text/plain")) return await res.text();
      try {
        return await res.json();
      } catch (error) {
        return undefined;
      }
    },
    formatterData: (d, rest, res, config) => d,
    formatterFile: async (res, config) => {
      const fileName = await config.formatterFileName(res, config);
      const blob = await res.blob();
      const file = new File([blob], fileName);
      return file;
    },
    formatterFileName: async (res, config) => {
      const disposition = res.headers.get("Content-Disposition")?.split("filename=")?.pop();
      const fName = decodeURIComponent(disposition);
      const fileName = config.fileName || fName;
      return fileName;
    },
    formatterBody: async (config) => {
      const body = config.body;
      if (typeof body === "function") return body();
      if (typeof body === "object") return body;
      return undefined;
    },
    parseBody: async (config) => {
      const contentType = config.headers["Content-Type"] || "";
      const body = await config.formatterBody(config);
      if (config.isFormBody) return objectParseFormData(body, true);
      if (config.isJsonBody) return JSON.stringify(body);
      if (contentType.includes("application/json")) return JSON.stringify(body);
      if (contentType.includes("form")) return objectParseFormData(body, true);
      return JSON.stringify(body);
    },
    formatterUrlParams: async (config) => {
      const urlParams = config.urlParams;
      if (typeof urlParams === "function") return urlParams();
      if (typeof urlParams === "object") return urlParams;
      return undefined;
    },
    downloadFile: (res, config, file) => {
      const elink = document.createElement("a");
      elink.download = file.name;
      elink.style.display = "none";
      elink.href = URL.createObjectURL(file);
      document.body.appendChild(elink);
      elink.click();
      URL.revokeObjectURL(elink.href);
      document.body.removeChild(elink);
    },
    interceptResponseSuccess: async (res, data, config) => data,
    interceptResponseError: (error, config, resolve, reject) => undefined,
    interceptRequest: (config) => undefined,
    onAbort: (error, config, resolve, reject) => undefined,
    onTimeoutAbort: (error, config, resolve, reject) => undefined,
    onLoading: (error, config, resolve, reject) => undefined,
    onRequest: (config) => undefined,
    onResponse: (config) => undefined,
    time: 30000,
    isDownloadFile: false,
    fileName: "",
    url: "",
    baseUrl: "",
    urlParams: undefined,
    body: undefined,
    isFormBody: false,
    isJsonBody: false,
    errorLog: false,
  };

  __ = {
    controller: new AbortController(),
    timeoutId: 0,
    finish: () => {},
    props: {},
    fetchEvents: arrayEvents(),
  };

  constructor(props = {}) {
    this.props = props;
  }

  send(options = {}, props = {}) {
    const { throwLoad = false, isBegin = false } = props;
    const config = merge(this.config, this.props, options);
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(errTimeout), config.time);
    this.__.controller = controller;
    this.__.timeoutId = timeoutId;
    return new Promise(async (resolve, reject) => {
      const success = (d) => {
        this.loading = false;
        this.data = d;
        this.error = false;
        this.begin = false;
        this.errorData = undefined;
        config.onResponse(config);
        resolve(d);
      };

      const fail = (e) => {
        this.loading = false;
        this.errorData = e;
        this.error = true;
        this.begin = false;
        config.onResponse(config);
        reject(e);
      };

      try {
        if (this.loading === true && throwLoad) throw errLoading;
        const timerController = { controller, timeoutId };
        this.__.fetchEvents.push(timerController);
        this.loading = true;
        if (isBegin) this.begin = true;
        this.error = false;
        config.interceptRequest(config);
        config.onRequest(config);
        const fetchFun = config.fetch || fetch;
        let url = config.baseUrl + config.url;
        url = url + objectParseUri(url, await config.formatterUrlParams(config));
        const body = await config.parseBody(config);
        const args = [url, { ...config, signal: controller.signal, body }];
        const res = await fetchFun(...args).finally(() => {
          clearTimeout(timeoutId);
          this.__.fetchEvents.remove(timerController);
        });
        if (!res.ok) throw res;
        const data = await config.formatterResponse(res, config);
        if (config.isDownloadFile) config.downloadFile(res, config, data);
        if (!config.interceptResponseSuccess) return success(data);
        const final = config.interceptResponseSuccess(res, data, config);
        if (!(final instanceof Promise)) return success(final);
        final
          .then(async (d) => success(await config.formatterData(d, data, res, config)))
          .catch(fail);
      } catch (error) {
        if (error?.status === 20) {
          config.onAbort(error, config, resolve, reject);
          config.onResponse(config);
          return;
        }

        if (error?.status === 41) {
          config.onLoading(error, config, resolve, reject);
          return;
        }

        if (config.errorLog) console.log("请求出错了*****", error);

        (() => {
          if (error?.status === 48) {
            config.onTimeoutAbort(error, config, resolve, reject);
            return;
          }
          config.interceptResponseError(error, config, resolve, reject);
        })();

        this.error = true;
        this.errorData = error;
        this.loading = false;
        this.begin = false;
        reject(error);
        config.onResponse(config);
      }
    });
  }
  nextSend(options) {
    this.abort();
    return this.send(options);
  }
  awaitSend(options) {
    return this.send(options, { throwLoad: true });
  }
  beginSend(options) {
    return this.send(options, { isBegin: true });
  }
  nextBeginSend(options) {
    this.abort();
    return this.send(options, { isBegin: true });
  }
  awaitBeginSend(options) {
    return this.send(options, { throwLoad: true, isBegin: true });
  }
  abortPrve() {
    this.__.controller.abort(errAbout);
    clearTimeout(this.__.timeoutId);
  }
  abort() {
    this.__.fetchEvents.events.forEach((el) => {
      console.log(el.timeoutId);
      el.controller.abort(errAbout);
      clearTimeout(el.timeoutId);
    });
  }
}
