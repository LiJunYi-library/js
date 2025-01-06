import {
  FetchHOCConfig,
  useFetchHOC,
  createFetchApi,
  FetchHook,
} from "@rainbow_ljy/v-hooks";
import md5 from "js-md5";
// import { RGlobalToast } from "@rainbow_ljy/v-view";

interface MYRes<T = any> {
  code: number;
  result: T;
  msg: string;
}

interface MYHeader {
  Token: string;
}

interface MYFetchConfig extends FetchHOCConfig<MYRes> {
  toast?: any;
  loadingToast?: any;
  newLoadingToast?: any;
  successToast?: any;
}

const opt: MYFetchConfig = {
  interceptRequest(fetchConfig, config) {},
  onRequest(fetchConfig, config) {
    const { loadingToast: to } = config;
    if (to.visible === false) return;
    config.newLoadingToast = { ...to, visible: true, loading: true };
    RGlobalToast.open(config.newLoadingToast);
  },
  onResponse(res, config) {
    const { loadingToast: to, newLoadingToast: newT } = config;
    if (to.visible === false) return;
    Object.assign(newT, { visible: false, loading: true });
    RGlobalToast.close(newT);
  },
  interceptResponseError(errorRes, config) {
    let message = errorRes.message || errorRes.error;
    if (errorRes?.code === 41) message = "正在加载中";
    RGlobalToast.show({ text: message });
  },
  interceptResponseSuccess(res, data, config) {
    if (data?.code !== 2000) {
      RGlobalToast.show({ text: data.msg });
      return Promise.reject(data);
    }
    const successToast = {
      visible: false,
      text: data.msg,
      ...config.successToast,
    };

    if (successToast.visible) RGlobalToast.show(successToast);
    return Promise.resolve(data.result);
  },
  loadingToast: {},
  toast: {},
};

export const useFetch = useFetchHOC(opt);

export const fetchApi = createFetchApi(useFetch);
