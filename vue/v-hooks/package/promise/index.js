import { promiseAbortController } from "@rainbow_ljy/rainbow-js";
import { ref } from "vue";

export function usePromise(fn, props = {}) {
  return promiseAbortController(fn, {
    loadingRef: ref,
    beginRef: ref,
    errorRef: ref,
    dataRef: ref,
    errorDataRef: ref,
    ...props,
  });
}
