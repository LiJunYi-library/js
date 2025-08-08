import { listRadio } from "@rainbow_ljy/rainbow-js";
import { ref } from "vue";

export function useListRadio(props = {}) {
  return listRadio({
    selectRef: ref,
    valueRef: ref,
    labelRef: ref,
    indexRef: ref,
    listRef: ref,
    ...props,
  });
}
