import { listPagination } from "@rainbow_ljy/rainbow-js";

import { ref } from "vue";

export function useListPagination(props) {
  return listPagination({
    selectRef: ref,
    valueRef: ref,
    labelRef: ref,
    indexRef: ref,
    listRef: ref,
    emptyRef: ref,
    totalRef: ref,
    currentPageRef: ref,
    pageSizeRef: ref,
    ...props,
  });
}
