import { listMultiple } from "@rainbow_ljy/rainbow-js";
import { ref } from "vue";
export function useListMultiple(props = {}) {
  return listMultiple({
    selectRef: ref,
    valueRef: ref,
    labelRef: ref,
    indexRef: ref,
    listRef: ref,
    ...props,
  });
}
