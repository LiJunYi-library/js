import { list } from "@rainbow_ljy/rainbow-js";
import { ref } from "vue";
import { useListSelect } from "../select/index";

export function useVList(props = {}) {
  return list({
    listDataRef: ref,
    currentPageRef: ref,
    pageSizeRef: ref,
    filterFunRef: ref,
    sortFunRef: ref,
    totalRef: ref,

    selectRef: ref,
    valueRef: ref,
    labelRef: ref,
    indexRef: ref,
    listRef: ref,
    ...props,
  });
}
