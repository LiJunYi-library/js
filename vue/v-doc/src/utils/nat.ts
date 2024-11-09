import {
  FetchHOCConfig,
  useFetchHOC,
  createFetchApi,
} from "@rainbow_ljy/v-hooks";
import { RGlobalToast } from "@rainbow_ljy/v-view";

interface MYRes<T = any> {
  Code: number;
  Data: T;
  msg: string;
  error: string;
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
  formatterResponse: async (res, config) => {
    let d;
    if (config.isDownloadFile) {
      d = await config.formatterFile?.(res, config);
      return d;
    }
    d = await res.json();
    return d;
  },
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
  interceptResponseSuccess(res, data, config) {
    if (data instanceof Array) data = data[0];

    if (data?.error) {
      RGlobalToast.show({ text: data.msg || data.error });
      return Promise.reject(data);
    }

    const successToast = {
      visible: false,
      text: data.msg || data.error,
      ...config.successToast,
    };
    if (successToast.visible) RGlobalToast.show(successToast);
    return Promise.resolve(data);
  },
  interceptResponseError(errorRes, config) {
    let message = errorRes.message || errorRes.error;
    if (errorRes?.code === 41) message = "正在加载中";
    RGlobalToast.show({ text: message });
  },
  loadingToast: {},
  toast: {},
};

export const useNat = useFetchHOC(opt);

export const natApi = createFetchApi(useNat);
