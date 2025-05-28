import { list } from "@rainbow_ljy/rainbow-js";
import { ref } from "vue";

export function useVList(props = {}) {
  return list({
    currentPageRef: ref,
    pageSizeRef: ref,
    totalRef: ref,
    listDataRef: ref,
    filterFunRef: ref,
    sortFunRef: ref,
    manageListFunRef: ref,

    selectRef: ref,
    valueRef: ref,
    labelRef: ref,
    indexRef: ref,
    listRef: ref,
    ...props,
  });
}
