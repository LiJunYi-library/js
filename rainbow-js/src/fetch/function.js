import { proxy, ref } from "../proxy";
import { arrayEvents } from "../array";
import { objectParseFormData, objectIsEmpty, objectForIn } from "../object";

function mergePropertys(...args) {
  const headersArr = args.map((el) => el?.headers);
  const headers = JSON.parse(JSON.stringify(Object.assign({}, ...headersArr)));
  return { headers };
}

function merge(...args) {
  return Object.assign({}, ...args, mergePropertys(...args));
}

function undNull(v) {
  if (v === undefined) return true;
  if (v === null) return true;
  return false;
}

const errLoading = { error: "loading", message: "loading", code: 41, status: 41 };
const errTimeout = { error: "Request Timeout", message: "Request Timeout", code: 48, status: 48 };
const errAbout = { error: "about", message: "about", code: 20, status: 20 };

function getRequestProps(o1 = {}, o2 = {}) {
  return {
    loadingRef: ref,
    beginRef: ref,
    errorRef: ref,
    dataRef: ref,
    errorDataRef: ref,
    loading: false,
    begin: false,
    error: false,
    data: undefined,
    errorData: undefined,
    formatterResponse: async (res, config) => {
      try {
        const contentType = res.headers.get("Content-Type");
        if (contentType.includes("application/json")) return await res.json();
        if (contentType.includes("application/octet-stream")) {
          if (config.formatterFile) return await config.formatterFile(res, config);
          return await res.blob();
        }
        if (contentType.includes("text/plain")) return await res.text();
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
      const body = config.body;
      if (undNull(body)) return undefined;
      const contentType = config.headers["Content-Type"] || "";
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
      if (typeof urlParams === "string") return urlParams;
      return undefined;
    },
    parseUrlParams: async (config) => {
      const urlParams = config.urlParams;
      if (undNull(urlParams)) return "";
      if (typeof urlParams === "string") return urlParams;
      if (typeof urlParams !== "object") return "";
      if (!objectIsEmpty(urlParams)) return "";
      const params = new URLSearchParams();
      objectForIn(urlParams, (item, key) => {
        if (item === undefined) return;
        if (typeof item === "object" && !(item instanceof Array)) item = JSON.stringify(item);
        params.set(key, item);
      });
      return params.toString() || "";
    },
    parseUrl: (config) => {
      const url = new URL(config.url, config.baseUrl);
      if (!config.urlParams) return url.toString();
      const arr = [url.href, config.urlParams];
      if (url.href.endsWith("&") || url.href.endsWith("?")) return arr.join("");
      if (url.href.includes("?")) return arr.join("&");
      return arr.join("?");
    },
    downloadFile: (res, config, file) => {
      const elink = document.createElement("a");
      elink.download = file.name || "download";
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
    ...o1,
    ...o2,
  };
}

export function fetchHOC(opt = {}) {
  return function useFetch(opt2 = {}) {
    const options = getRequestProps(opt, opt2);
    const { loadingRef, beginRef, errorRef, dataRef, errorDataRef } = options;
    const loading = loadingRef(options.loading);
    const begin = beginRef(options.begin);
    const error = errorRef(options.error);
    const data = dataRef(options.data);
    const errorData = errorDataRef(options.errorData);
    const fetchEvents = arrayEvents();

    const hooks = proxy({
      loading,
      begin,
      error,
      data,
      errorData,
      send,
      nextSend,
      awaitSend,
      beginSend,
      nextBeginSend,
      awaitBeginSend,
      abort,
    });

    function send(opt3 = {}, props = {}) {
      const { throwLoad = false, isBegin = false } = props;
      const config = merge(getRequestProps(), opt, opt2, opt3);
      return new Promise(async (resolve, reject) => {
        const success = (d) => {
          loading.value = false;
          data.value = d;
          error.value = false;
          begin.value = false;
          errorData.value = undefined;
          config.onResponse(config);
          resolve(d);
        };

        const fail = (e) => {
          loading.value = false;
          data.value = undefined;
          error.value = true;
          errorData.value = e;
          config.onResponse(config);
          reject(e);
        };

        try {
          if (loading.value === true && throwLoad) throw errLoading;
          let controller = new AbortController();
          let timeoutId = setTimeout(() => controller.abort(errTimeout), config.time);
          const timerController = { controller, timeoutId };
          fetchEvents.push(timerController);
          loading.value = true;
          if (isBegin) begin.value = true;
          error.value = false;
          config.body = await config.formatterBody(config);
          config.urlParams = await config.formatterUrlParams(config);
          await config.interceptRequest(config);
          config.body = await config.parseBody(config);
          config.urlParams = await config.parseUrlParams(config);
          const url = await config.parseUrl(config);
          const args = [url, { ...config, signal: controller.signal }];
          const fetchFun = config.fetch || fetch;
          config.onRequest(config);
          const res = await fetchFun(...args).finally(() => {
            clearTimeout(timeoutId);
            fetchEvents.remove(timerController);
          });
          if (!res.ok) throw res;
          const _data = await config.formatterResponse(res, config);
          if (config.isDownloadFile) config.downloadFile(res, config, _data);
          if (!config.interceptResponseSuccess) return success(_data);
          const final = config.interceptResponseSuccess(res, _data, config);
          if (!(final instanceof Promise)) return success(final);
          final
            .then(async (d) => success(await config.formatterData(d, _data, res, config)))
            .catch(fail);
        } catch (_err) {
          if (_err?.status === 20) {
            config.onAbort(_err, config, resolve, reject);
            config.onResponse(config);
            return;
          }

          if (_err?.status === 41) {
            config.onLoading(_err, config, resolve, reject);
            return;
          }

          if (config.errorLog) console.log("请求出错了*****", _err);

          (() => {
            if (_err?.status === 48) {
              config.onTimeoutAbort(_err, config, resolve, reject);
              return;
            }
            config.interceptResponseError(_err, config, resolve, reject);
          })();

          fail(_err);
        }
      });
    }

    function nextSend(args) {
      abort();
      return send(args);
    }

    function awaitSend(args) {
      return send(args, { throwLoad: true });
    }

    function beginSend(args) {
      return send(args, { isBegin: true });
    }

    function nextBeginSend(args) {
      abort();
      return send(args, { isBegin: true });
    }

    function awaitBeginSend(args) {
      return send(args, { throwLoad: true, isBegin: true });
    }

    function abort() {
      const eList = [...fetchEvents.events];
      eList.forEach((el) => {
        clearTimeout(el.timeoutId);
        el.controller.abort(errAbout);
      });
    }

    return hooks;
  };
}
