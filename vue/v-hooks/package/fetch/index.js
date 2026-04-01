import { fetchHOC } from "@rainbow_ljy/rainbow-js";
import { ref, isRef } from "vue";

export function useFetchHOC(props = {}) {
  return fetchHOC({
    loadingRef: ref,
    beginRef: ref,
    errorRef: ref,
    dataRef: ref,
    errorDataRef: ref,
    formatterUrlParams: async (config) => {
      const { urlParams } = config;
      if (isRef(urlParams)) return urlParams.value;
      if (typeof urlParams === "function") return urlParams();
      return urlParams;
    },
    formatterBody: async (config) => {
      const body = config.body;
      if (isRef(body)) return body.value;
      if (typeof body === "function") return body();
      return body;
    },
    ...props,
  });
}
