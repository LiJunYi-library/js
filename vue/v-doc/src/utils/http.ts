import {
  FetchHOCConfig,
  useFetchHOC,
  createFetchApi,
  FetchHook,
} from "@rainbow_ljy/v-hooks";
import md5 from "js-md5";
import { RGlobalToast } from "@rainbow_ljy/v-view";

function dateFormat() {
  const date = new Date();
  const year = date.getFullYear();
  const month =
    date.getMonth() + 1 < 10 ? `0${date.getMonth() + 1}` : date.getMonth() + 1;
  const day = date.getDate() < 10 ? `0${date.getDate()}` : date.getDate();
  const h = date.getHours() < 10 ? `0${date.getHours()}` : date.getHours();
  const m =
    date.getMinutes() < 10 ? `0${date.getMinutes()}` : date.getMinutes();
  const s =
    date.getSeconds() < 10 ? `0${date.getSeconds()}` : date.getSeconds();
  return `${year}${month}${day}${h}${m}${s}555`;
}

const CalcuMD5 = function (pwd: string) {
  let pwds;
  pwds = pwd.toLowerCase();
  pwds = md5(pwds);
  return pwds;
};

interface MYRes<T = any> {
  code: number;
  data: T;
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
  time: 100000,
  initHeaders: {
    "Content-Type": "application/json;charset=UTF-8",
  },
  interceptRequest(fetchConfig, config) {
    const time = dateFormat();
    fetchConfig.headers.sign = CalcuMD5(fetchConfig.url + time);
    fetchConfig.headers.time = time;

    const Token =
      "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJleHAiOjE3MDQwOTI4MzgsInVzZXJJZCI6NDA1LCJ1c2VybmFtZSI6ImFkbWluIn0.zv_sfwg3spfbHMoccbeKlwh_ZLV9q8PnSDCbyusfKrc";
    fetchConfig.headers.Token = Token;
  },
  onRequest(fetchConfig, config) {
    // const { loadingToast: to } = config;
    // if (to.visible === false) return;
    // config.newLoadingToast = { ...to, visible: true, loading: true };
    // RGlobalToast.open(config.newLoadingToast);
  },
  onResponse(res, config) {
    // const { loadingToast: to, newLoadingToast: newT } = config;
    // if (to.visible === false) return;
    // Object.assign(newT, { visible: false, loading: true });
    // RGlobalToast.close(newT);
  },

  interceptResponseSuccess(res, data, config) {
    // console.log("interceptResponseSuccess", data);

    if (data?.code !== 200) {
      RGlobalToast.show({ text: data.msg });
      return Promise.reject(data);
    }

    const successToast = {
      visible: false,
      text: data.msg,
      ...config.successToast,
    };

    if (successToast.visible) RGlobalToast.show(successToast);
    return Promise.resolve(data.data);
  },
  interceptResponseError(errorRes, config) {
    let message = errorRes.message || errorRes.error;
    if (errorRes?.code === 41) message = "正在加载中";
    RGlobalToast.show({ text: message });
  },
  loadingToast: {},
  toast: {},
};

export const useFetch = useFetchHOC(opt);

export const fetchApi = createFetchApi(useFetch);
