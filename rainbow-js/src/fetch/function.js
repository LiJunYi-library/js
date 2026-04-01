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
const AbortController = window?.AbortController ?? Abort_Controller;
const URL = window?.URL ?? URL_CLASS;
const URLSearchParams = window?.URLSearchParams ?? URLSearchParams_CLASS;

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
    throwResponse: async (res, config) => !res.ok,
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
      return body;
    },
    parseBody: async (config) => {
      const body = config.body;
      if (undNull(body)) return undefined;
      const contentType = config.headers["Content-Type"] || "";
      if (config.isFormBody) return objectParseFormData(body, true);
      if (config.isJsonBody) return JSON.stringify(body);
      if (contentType.includes("application/json")) return JSON.stringify(body);
      if (contentType.includes("form")) return objectParseFormData(body, true);
      return body;
    },
    formatterUrlParams: async (config) => {
      const urlParams = config.urlParams;
      if (typeof urlParams === "function") return urlParams();
      return urlParams;
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
    timeout: 30000,
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
          let timeoutId = setTimeout(() => controller.abort(errTimeout), config.timeout);
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
          if (await config.throwResponse(res, config)) throw res;
          const _data = await config.formatterResponse(res, config);
          if (config.isDownloadFile) config.downloadFile(res, config, _data);
          if (!config.interceptResponseSuccess) return success(_data);
          const final = config.interceptResponseSuccess(res, _data, config);
          if (!(final instanceof Promise)) return success(final);
          final
            .then(async (d) => success(await config.formatterData(d, _data, res, config)))
            .catch(fail);
        } catch (_err) {
          const errCode = _err?.status || _err?.code;
          if (errCode === 20) {
            loading.value = false;
            begin.value = false;
            config.onAbort(_err, config, resolve, reject);
            config.onResponse(config);
            return;
          }

          if (errCode === 41) {
            config.onLoading(_err, config, resolve, reject);
            return;
          }

          if (config.errorLog) console.log("请求出错了*****", _err);

          (() => {
            if (errCode === 48) {
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

function Abort_Controller() {
  const listeners = [];
  const signal = {
    aborted: false,
    reason: undefined,
    addEventListener(type, listener) {
      if (type === "abort") listeners.push(listener);
    },
    removeEventListener(type, listener) {
      if (type === "abort") {
        const idx = listeners.indexOf(listener);
        if (idx !== -1) listeners.splice(idx, 1);
      }
    },
    dispatchEvent(event) {
      if (event.type === "abort") listeners.forEach((l) => l(event));
      return true;
    },
    throwIfAborted() {
      if (this.aborted) throw this.reason;
    },
  };

  return {
    signal,
    abort(reason) {
      if (signal.aborted) return;
      signal.aborted = true;
      signal.reason = reason;
      signal.dispatchEvent({ type: "abort" });
    },
  };
}

function URL_CLASS(url, base) {
  if (!url) throw new TypeError("Failed to construct 'URL': 1 argument required");

  // 拼接完整 url 字符串
  let fullUrl = url;
  if (base) {
    if (!base.endsWith("/") && !url.startsWith("/") && !url.startsWith("?") && !url.startsWith("#")) {
      const basePath = base.includes("?") ? base : base.replace(/\/[^/]*$/, "/");
      fullUrl = basePath + url;
    } else {
      fullUrl = base.replace(/\/$/, "") + (url.startsWith("/") ? url : "/" + url);
    }
  }

  // 解析协议
  const protocolMatch = fullUrl.match(/^([a-zA-Z][a-zA-Z\d+\-.]*):\/\//);
  const protocol = protocolMatch ? protocolMatch[1] + ":" : "";
  const afterProtocol = protocolMatch ? fullUrl.slice(protocolMatch[0].length) : fullUrl;

  // 解析 auth@host:port/path?search#hash
  const hashIdx = afterProtocol.indexOf("#");
  const hash = hashIdx !== -1 ? "#" + afterProtocol.slice(hashIdx + 1) : "";
  const beforeHash = hashIdx !== -1 ? afterProtocol.slice(0, hashIdx) : afterProtocol;

  const searchIdx = beforeHash.indexOf("?");
  const search = searchIdx !== -1 ? beforeHash.slice(searchIdx) : "";
  const beforeSearch = searchIdx !== -1 ? beforeHash.slice(0, searchIdx) : beforeHash;

  const slashIdx = beforeSearch.indexOf("/");
  const hostPart = slashIdx !== -1 ? beforeSearch.slice(0, slashIdx) : beforeSearch;
  const pathname = slashIdx !== -1 ? beforeSearch.slice(slashIdx) : "/";

  // 解析 user:pass@hostname:port
  const atIdx = hostPart.indexOf("@");
  const userInfo = atIdx !== -1 ? hostPart.slice(0, atIdx) : "";
  const hostAndPort = atIdx !== -1 ? hostPart.slice(atIdx + 1) : hostPart;
  const colonIdx = hostAndPort.lastIndexOf(":");
  const hostname = colonIdx !== -1 ? hostAndPort.slice(0, colonIdx) : hostAndPort;
  const port = colonIdx !== -1 ? hostAndPort.slice(colonIdx + 1) : "";
  const host = port ? hostname + ":" + port : hostname;

  const colonInUser = userInfo.indexOf(":");
  const username = colonInUser !== -1 ? userInfo.slice(0, colonInUser) : userInfo;
  const password = colonInUser !== -1 ? userInfo.slice(colonInUser + 1) : "";

  const origin = protocol && hostname ? protocol + "//" + host : "null";
  const href = fullUrl;

  const searchParams = new URLSearchParams(search.slice(1));

  return {
    href,
    origin,
    protocol,
    username,
    password,
    host,
    hostname,
    port,
    pathname,
    search,
    searchParams,
    hash,
    toString() { return this.href; },
    toJSON() { return this.href; },
  };
}

function URLSearchParams_CLASS(init) {
  const params = [];

  function parse(input) {
    if (!input) return;
    const str = input.startsWith("?") ? input.slice(1) : input;
    str.split("&").forEach((pair) => {
      if (!pair) return;
      const eqIdx = pair.indexOf("=");
      const key = decodeURIComponent(eqIdx !== -1 ? pair.slice(0, eqIdx) : pair).replace(/\+/g, " ");
      const val = decodeURIComponent(eqIdx !== -1 ? pair.slice(eqIdx + 1) : "").replace(/\+/g, " ");
      params.push([key, val]);
    });
  }

  if (typeof init === "string") {
    parse(init);
  } else if (Array.isArray(init)) {
    init.forEach(([k, v]) => params.push([String(k), String(v)]));
  } else if (init && typeof init === "object") {
    Object.keys(init).forEach((k) => params.push([k, String(init[k])]));
  }

  return {
    append(key, value) {
      params.push([String(key), String(value)]);
    },
    delete(key) {
      for (let i = params.length - 1; i >= 0; i--) {
        if (params[i][0] === key) params.splice(i, 1);
      }
    },
    get(key) {
      const found = params.find((p) => p[0] === key);
      return found ? found[1] : null;
    },
    getAll(key) {
      return params.filter((p) => p[0] === key).map((p) => p[1]);
    },
    has(key) {
      return params.some((p) => p[0] === key);
    },
    set(key, value) {
      const idx = params.findIndex((p) => p[0] === key);
      if (idx !== -1) {
        params[idx][1] = String(value);
        for (let i = params.length - 1; i > idx; i--) {
          if (params[i][0] === key) params.splice(i, 1);
        }
      } else {
        params.push([String(key), String(value)]);
      }
    },
    sort() {
      params.sort((a, b) => (a[0] < b[0] ? -1 : a[0] > b[0] ? 1 : 0));
    },
    keys() {
      return params.map((p) => p[0])[Symbol.iterator]();
    },
    values() {
      return params.map((p) => p[1])[Symbol.iterator]();
    },
    entries() {
      return params.slice()[Symbol.iterator]();
    },
    forEach(callback, thisArg) {
      params.forEach(([k, v]) => callback.call(thisArg, v, k, this));
    },
    toString() {
      return params
        .map(([k, v]) => encodeURIComponent(k) + "=" + encodeURIComponent(v))
        .join("&");
    },
    get size() {
      return params.length;
    },
    [Symbol.iterator]() {
      return this.entries();
    },
  };
}
