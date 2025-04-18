import { isRef, ref } from "vue";
import { useReactive } from "../../other";
import { downloadFile, arrayEvents, arrayRemove, createOverload } from "@rainbow_ljy/rainbow-js";

// todo AbortController 有兼容问题需要手动实现
function AbortController(...arg) {
  if (window.AbortController) return new window.AbortController(...arg);
  return {
    signal: {
      addEventListener() {},
    },
    abort() {},
  };
}

const errLoading = { error: "loading", message: "loading", code: 41, status: 41 };
const errTimeout = { error: "Request Timeout", message: "Request Timeout", code: 48, status: 48 };
const errAbout = { error: "about", message: "about", code: 20, status: 20 };

function getBody(config) {
  if (!config.body) return undefined;
  if (config.body instanceof Function) return config.body();
  if (isRef(config.body)) return config.body.value;
  return config.body;
}

function revBody(contentType, config, body) {
  const _body = body || getBody(config);
  if (!_body) return undefined;
  if (typeof _body !== "object") return _body;
  const jsonBody = JSON.stringify(_body);
  const formBody = (() => {
    const formData = new FormData();
    for (const key in _body) {
      if (Object.prototype.hasOwnProperty.call(_body, key)) {
        if (_body[key] !== undefined) formData.append(key, _body[key]);
      }
    }
    return formData;
  })();
  if (config.isFormData) return formBody;
  if (config.isFormBody) return formBody;
  if (config.isJsonBody) return jsonBody;
  if (contentType.includes("application/json")) return jsonBody;
  if (contentType.includes("form")) return formBody;
  return formBody;
}

function getHeaders(config) {
  const headers_ = config.initHeaders || {};
  if (config.contentType) headers_["Content-Type"] = config.contentType;
  if (config.headers instanceof Function) return config.headers(config);
  if (config.headers) return config.headers;
  return headers_;
}

function assign(...args) {
  const obj = {};
  const initHeaders = {};
  const initHeadersList = args.map((el) => el?.initHeaders ?? {});
  Object.assign(obj, ...args);
  Object.assign(initHeaders, ...initHeadersList);
  obj.initHeaders = initHeaders;
  return obj;
}

function getParams(config) {
  if (!config.urlParams) return undefined;
  if (config.urlParams instanceof Function) return config.urlParams();
  if (isRef(config.urlParams)) return config.urlParams.value;
  return config.urlParams;
}

export function parseParams(url = "", object) {
  if (!object) return "";
  if (typeof object !== "object") return object;
  if (!Object.keys(object).length) return "";
  let str = "";
  for (const key in object) {
    if (Object.hasOwnProperty.call(object, key)) {
      let element = object[key];
      if (typeof element === "object") {
        if (element instanceof Array) element = element.toString();
        else element = JSON.stringify(element);
      }
      if (element === undefined) continue;
      if (element + "" === "NaN") element = null;
      str += `${key}=${element}&`;
    }
  }
  str = str.slice(0, -1);
  if (url && url.includes("?")) return `&${str}`;
  return `?${str}`;
}

export function fetchQueue(props = {}) {
  const options = {
    onBegin: () => undefined,
    onFinish: () => undefined,
    onRequest: () => undefined,
    onResponse: () => undefined,
    ...props,
  };
  const queue = [];
  function push(pro, ...arg) {
    if (queue.length === 0) options.onBegin(...arg);
    options.onRequest(...arg);
    queue.push(pro);
  }
  function del(pro, ...arg) {
    arrayRemove(queue, pro);
    options.onResponse(...arg);
  }
  function remove(pro, ...arg) {
    arrayRemove(queue, pro);
    options.onResponse(...arg);
    if (queue.length === 0) options.onFinish(...arg);
  }
  return { queue, push, remove, del };
}

export function useFetchHOC(props = {}) {
  const options = {
    formatterFile: async (res, config) => {
      const file = await res.blob();
      return file;
    },
    formatterFileName: async (res, config) => {
      const disposition = res.headers.get("Content-Disposition")?.split("filename=")?.pop();
      const fName = decodeURIComponent(disposition);
      const fileName = config.fileName || fName;
      return fileName;
    },
    formatterResponse: async (res, config) => {
      let d;
      if (config.isDownloadFile) {
        d = await config.formatterFile(res, config);
        return d;
      }
      const resContentType = res.headers.get("Content-Type");

      if (resContentType.includes("application/json")) {
        d = await res.json();
        return d;
      }

      d = await res.text();
      return d;
    },
    formatterData: (d) => d,
    formatterBody: (contentType, body, config) => revBody(contentType, config),
    interceptRequest: () => undefined,
    interceptResponseSuccess: () => undefined,
    interceptResponseError: () => undefined,
    onRequest: () => undefined,
    onResponse: () => undefined,
    urlParams: undefined,
    body: undefined,

    url: "",
    baseUrl: "",
    time: 30000,
    isDownloadFile: false,
    fileName: "",
    loading: false,
    begin: false,
    error: false,
    data: undefined,
    errorData: undefined,
    isPushQueue: true,
    fetchQueue: undefined,
    ...props,
  };

  function useFetch(props2 = {}) {
    const configs = assign(options, props2);
    let controller = new AbortController();
    let timer;
    const events = arrayEvents();
    const successEvents = arrayEvents();
    const errEvents = arrayEvents();
    const fetchEvents = arrayEvents();
    const loading = ref(configs.loading);
    const data = ref(configs.data);
    const begin = ref(configs.begin);
    const error = ref(configs.error);
    const errorData = ref(configs.errorData);

    const params = useReactive({
      loading,
      data,
      begin,
      error,
      errorData,
      events,
      errEvents,
      successEvents,
      send,
      nextSend,
      awaitSend,
      beginSend,
      nextBeginSend,
      awaitBeginSend,
      abort,
      abortAll,
    });

    function send(...arg) {
      return new Promise((resolve, reject) => {
        asyncSend(...arg)
          .then((...res) => {
            resolve(...res);
          })
          .catch((err) => {
            if (err) reject(err);
          });
      });
    }

    async function asyncSend(props3) {
      const config = assign(configs, props3);
      const curController = new AbortController();
      const signalPromise = new Promise((resolve) => {
        curController.signal.addEventListener("abort", () => {
          resolve(curController.signal.reason);
        });
      });
      controller = curController;
      const url = config.baseUrl + config.url + parseParams(config.url, getParams(config));
      const headers = getHeaders(config);
      const body = config.formatterBody(headers["Content-Type"], getBody(config), config);
      const fetchConfig = {
        ...config,
        url,
        headers,
        method: config.method,
        signal: controller.signal,
        body,
      };
      config?.interceptRequest?.(fetchConfig, config);
      const URL = fetchConfig.url;
      const current = { timer: undefined, controller: curController };
      fetchEvents.push(current);
      let fetchPromise;

      if (config.time) {
        current.timer = setTimeout(() => {
          curController.abort(errTimeout);
        }, config.time);
        timer = current.timer;
      }

      const success = (successData) => {
        loading.value = false;
        data.value = successData;
        error.value = false;
        errorData.value = undefined;
        fetchEvents.remove(current);
        successEvents.invoke(successData);
        config?.onSuccess?.(successData);
        clearTimeout(current.timer);
        options.fetchQueue?.remove?.(fetchPromise, config, params);
      };

      const fail = (failData) => {
        loading.value = false;
        error.value = true;
        errorData.value = failData;
        fetchEvents.remove(current);
        errEvents.invoke(failData);
        config?.onFail?.(failData);
        clearTimeout(current.timer);
        options.fetchQueue?.remove?.(fetchPromise, config, params);
      };

      try {
        error.value = false;
        errorData.value = undefined;
        loading.value = true;
        config.onRequest(fetchConfig, config);
        events.invoke(params);
        if (config.isDeleteContentType) delete fetchConfig.headers["Content-Type"];
        if (config.fetch) fetchPromise = config.fetch(URL, fetchConfig);
        else fetchPromise = fetch(URL, fetchConfig);
        if (config.isPushQueue) options.fetchQueue?.push?.(fetchPromise, config, params);
        const res = await fetchPromise;
        const d = await config.formatterResponse(res, config);
        if (!res.ok) throw d;

        if (config.isDownloadFile) {
          const fileName = await config.formatterFileName(res, config);
          downloadFile(d, fileName);
        }

        config.onResponse(res, config);
        if (config.interceptResponseSuccess) {
          const reset = config.interceptResponseSuccess(res, d, config);
          if (reset instanceof Promise) {
            return reset
              .catch((mErr) => {
                fail(mErr);
                return Promise.reject(errorData.value);
              })
              .then(async (mRes) => {
                success(config.formatterData(mRes, d, res, config));
                return Promise.resolve(data.value);
              });
          }
        }

        success(d);
        return data.value;
      } catch (err) {
        console.error(err?.code, "errorRes", err);
        config.onResponse(err, config);
        fetchEvents.remove(current);

        let errorRes = err;
        const interceptCode = [20];

        if (err?.code === 20) {
          options.fetchQueue?.del?.(fetchPromise, config, params);
          errorRes = await signalPromise;
        }

        if (!interceptCode.some((num) => num === errorRes?.code)) {
          const errReset = config.interceptResponseError(errorRes, config);
          fail(errorRes);
          if (errReset) throw errReset;
        }
        throw undefined;
      }
    }

    function nextSend(...arg) {
      controller.abort(errAbout);
      clearTimeout(timer);
      return send(...arg);
    }

    function awaitSend(...arg) {
      if (loading.value === true) throw errLoading;
      return send(...arg);
    }

    async function beginSend(...arg) {
      begin.value = true;
      try {
        return await send(...arg);
      } finally {
        begin.value = false;
      }
    }

    async function nextBeginSend(...arg) {
      begin.value = true;
      try {
        return await nextSend(...arg);
      } finally {
        begin.value = false;
      }
    }

    function awaitBeginSend(...arg) {
      if (loading.value === true) throw errLoading;
      return beginSend(...arg);
    }

    function abort() {
      controller.abort(errAbout);
      clearTimeout(timer);
      loading.value = false;
      begin.value = false;
    }

    function abortAll() {
      fetchEvents.invokes((item) => {
        item.controller.abort(errAbout);
        clearTimeout(item.timer);
      });
      loading.value = false;
      begin.value = false;
    }

    return params;
  }

  return useFetch;
}

export function createFetchApi(useFetch) {
  const post = createOverload((overload) => {
    const postFetch = (arg = {}) =>
      useFetch({
        method: "post",
        initHeaders: { "Content-Type": "application/json;charset=UTF-8" },
        ...arg,
      });
    overload.addimpl("Object", (obj) => postFetch(obj));
    overload.addimpl("String", (url) => postFetch({ url }));
    overload.addimpl(["String", "Object"], (url, body) => postFetch({ url, body }));
    overload.addimpl(["String", "Function"], (url, body) => postFetch({ url, body }));
  }, false);

  const get = createOverload((overload) => {
    overload.addimpl("String", (url) => useFetch({ method: "get", url }));
    overload.addimpl(["String", "Object"], (url, urlParams) =>
      useFetch({ method: "get", url, urlParams }),
    );
    overload.addimpl(["String", "Function"], (url, urlParams) =>
      useFetch({ method: "get", url, urlParams }),
    );
  }, false);

  return { post, get };
}

export function transformFetch(fun) {
  return (...args) => {
    const [url, config] = args;
    const { signal } = config;
    return new Promise((resolve, reject) => {
      signal.addEventListener("abort", () => {
        reject(signal?.reason);
      });
      fun(resolve, reject, ...args);
    });
  };
}

export function promiseTransformFetch(fun) {
  return transformFetch((resolve, reject, ...args) => {
    const mPromise = fun(...args);
    if (mPromise instanceof Promise) {
      mPromise
        .then((success) => {
          try {
            success.ok = 1;
          } catch (error) {
            console.error("success is not object");
          }
          resolve(success);
        })
        .catch((...error) => {
          reject(...error);
        });
    }
  });
}
