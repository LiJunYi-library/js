import { listLoad } from "@rainbow_ljy/rainbow-js";
import { ref } from "vue";

export function useListLoad(props) {
  return listLoad({
    selectRef: ref,
    valueRef: ref,
    labelRef: ref,
    indexRef: ref,
    listRef: ref,

    beginRef: ref,
    finishedRef: ref,
    emptyRef: ref,
    totalRef: ref,
    currentPageRef: ref,
    pageSizeRef: ref,
    ...props,
  });
}
