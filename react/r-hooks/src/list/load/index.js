import { listLoad } from "@rainbow_ljy/rainbow-js";
import { useMemoRef, useOneceMemo } from "../../utils";

export function useListLoad(props) {
  const select = useMemoRef();
  const value = useMemoRef();
  const label = useMemoRef();
  const index = useMemoRef();
  const list = useMemoRef();

  const begin = useMemoRef();
  const finished = useMemoRef();
  const empty = useMemoRef();
  const total = useMemoRef();
  const currentPage = useMemoRef();
  const pageSize = useMemoRef();

  return useOneceMemo(() =>
    listLoad({
      selectRef: select.toRef,
      valueRef: value.toRef,
      labelRef: label.toRef,
      indexRef: index.toRef,
      listRef: list.toRef,

      beginRef: begin.toRef,
      finishedRef: finished.toRef,
      emptyRef: empty.toRef,
      totalRef: total.toRef,
      currentPageRef: currentPage.toRef,
      pageSizeRef: pageSize.toRef,
      ...props,
    }),
  );
}
