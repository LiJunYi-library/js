import { proxy, ref } from "../proxy";
import { arrayEvents } from "../array";

const errLoading = { error: "loading", message: "loading", code: 41, status: 41 };
const errTimeout = { error: "Request Timeout", message: "Request Timeout", code: 48, status: 48 };
const errAbout = { error: "about", message: "about", code: 20, status: 20 };

function geProps(props = {}) {
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
    time: 5000,
    onAbort: (error, config, resolve, reject) => undefined,
    onTimeoutAbort: (error, config, resolve, reject) => undefined,
    onLoading: (error, config) => undefined,
    ...props,
  };
}

export function promiseAbortController(fn, props) {
  const config = geProps(props);
  const { loadingRef, beginRef, errorRef, dataRef, errorDataRef } = config;
  const loading = loadingRef(config.loading);
  const begin = beginRef(config.begin);
  const error = errorRef(config.error);
  const data = dataRef(config.data);
  const errorData = errorDataRef(config.errorData);
  const pEvents = arrayEvents();
  let prveController = new AbortController();

  const hooks = proxy({
    loading,
    begin,
    error,
    data,
    errorData,
    send,
    nextSend,
    awaitSend,
    abortPrve,
    abort,
  });

  function _apply(options = {}, ...args) {
    const { throwLoad = false, isBegin = false } = options;
    if (loading.value === true && throwLoad) {
      config.onLoading(errLoading, config);
      throw errLoading;
    }

    let controller = new AbortController();
    prveController = controller;
    let signal = controller.signal;
    let timeoutId = setTimeout(() => {
      console.log("setTimeout");
      controller?.abort?.(errTimeout);
    }, config.time);
    const timerController = { controller, timeoutId };
    pEvents.push(timerController);

    return new Promise(async (resolve, reject) => {
      function final() {
        pEvents.remove(timerController);
        signal.removeEventListener("abort", onAbort);
        clearTimeout(timeoutId);
      }

      const success = (d) => {
        loading.value = false;
        data.value = d;
        error.value = false;
        begin.value = false;
        errorData.value = undefined;
        final();
        resolve(d);
        console.log("success");
      };

      const fail = (e) => {
        loading.value = false;
        data.value = undefined;
        error.value = true;
        begin.value = false;
        errorData.value = e;
        final();
        reject(e);
        console.log("fail");
      };

      function onAbort(event) {
        const reason = event.currentTarget.reason;
        const { code, message } = reason;
        console.log("onAbort ----- ", message);

        if (code === 48) {
          config.onTimeoutAbort(reason, config, resolve, reject);
          fail(reason);
          return;
        }

        loading.value = false;
        begin.value = false;
        config.onAbort(reason, config, resolve, reject);
        final();
      }

      signal.addEventListener("abort", onAbort);
      if (signal.aborted) return final();

      loading.value = true;
      if (isBegin) begin.value = true;
      error.value = false;

      try {
        let result = await fn(...args);
        if (signal.aborted) return;
        success(result);
      } catch (err) {
        if (signal.aborted) return;
        fail(err);
      }
    });
  }

  function send(...args) {
    return _apply(undefined, ...args);
  }

  function nextSend(...args) {
    abort();
    return _apply(undefined, ...args);
  }

  function awaitSend(...args) {
    return _apply({ throwLoad: true }, ...args);
  }

  function abortPrve() {
    prveController?.abort?.(errAbout);
  }

  function abort() {
    const eList = [...pEvents.events];
    eList.forEach((el) => el.controller.abort(errAbout));
  }

  return hooks;
}
