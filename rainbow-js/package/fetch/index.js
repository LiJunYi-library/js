const errLoading = { error: "loading", message: "loading", code: 41, status: 41 };
const errTimeout = { error: "Request Timeout", message: "Request Timeout", code: 48, status: 48 };
const errAbout = { error: "about", message: "about", code: 20, status: 20 };

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

  constructor() {}

  config = {
    formatterResponse: async (res, config) => {
      const contentType = res.headers.get("Content-Type");
      if (contentType.includes("application/json")) return await res.json();
      if (contentType.includes("application/octet-stream")) return await res.blob();
      if (contentType.includes("text/plain")) return await res.text();
      try {
        return await res.json();
      } catch (error) {
        return undefined;
      }
    },
    interceptResponseSuccess: async (res, data, config) => {
      try {
        if (data.code !== 200) throw data;
        return data.data;
      } catch (error) {
        return Promise.reject(error);
      }
    },
    interceptResponseError: (error, config, resolve, reject) => undefined,
    onAbort: (error, config, resolve, reject) => undefined,
    onTimeoutAbort: (error, config, resolve, reject) => undefined,
    onLoading: (error, config, resolve, reject) => console.log("正在加载中"),
  };

  __ = {
    controller: new AbortController(),
    timeoutId: 0,
    finish: () => {},
  };

  send(options = {}, props = {}) {
    const { throwLoad = false, isBegin = false } = props;
    const config = { ...this.config, ...options };
    this.__.controller = new AbortController();
    const { controller } = this.__;
    this.__.timeoutId = setTimeout(() => controller.abort(errTimeout), 2000);
    return new Promise(async (resolve, reject) => {
      const success = (d) => {
        this.loading = false;
        this.data = d;
        this.begin = false;
        resolve(d);
      };

      const fail = (e) => {
        this.loading = false;
        this.errorData = e;
        this.error = true;
        this.begin = false;
        reject(e);
      };

      try {
        if (this.loading === true && throwLoad) throw errLoading;
        this.loading = true;
        if (isBegin) this.begin = true;
        this.error = false;
        const res = await fetch(config.uri, { signal: controller.signal, ...config });
        if (!res.ok) throw res;
        const data = await config.formatterResponse(res, config);
        if (!config.interceptResponseSuccess) return success(data);
        const final = config.interceptResponseSuccess(res, data, config);
        if (!(final instanceof Promise)) return success(final);
        final.then(success).catch(fail);
      } catch (error) {
        if (error?.status === 20) {
          config.onAbort(error, config, resolve, reject);
          return;
        }

        if (error?.status === 41) {
          config.onLoading(error, config, resolve, reject);
          return;
        }

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
  abort() {
    this.__.controller.abort(errAbout);
    clearTimeout(this.__.timeoutId);
  }
  abortAll() {}
}

function downloadFile(buffer, fileName) {
  const blob = new Blob([buffer]);
  const elink = document.createElement("a");
  elink.download = fileName;
  elink.style.display = "none";
  elink.href = URL.createObjectURL(blob);
  document.body.appendChild(elink);
  elink.click();
  URL.revokeObjectURL(elink.href);
  document.body.removeChild(elink);
}
