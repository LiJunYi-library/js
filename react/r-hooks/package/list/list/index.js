import { list } from "@rainbow_ljy/rainbow-js";
import { useMemoRef, useOneceMemo } from "../../utils";

export function useList(props = {}) {
  const currentPage = useMemoRef();
  const pageSize = useMemoRef();
  const total = useMemoRef();
  const listData = useMemoRef();
  const filterFun = useMemoRef();
  const sortFun = useMemoRef();
  const manageListFun = useMemoRef();
  const select = useMemoRef();
  const value = useMemoRef();
  const label = useMemoRef();
  const index = useMemoRef();
  const listArr = useMemoRef();

  return useOneceMemo(() =>
    list({
      currentPageRef: currentPage.toRef,
      pageSizeRef: pageSize.toRef,
      totalRef: total.toRef,
      listDataRef: listData.toRef,
      filterFunRef: filterFun.toRef,
      sortFunRef: sortFun.toRef,
      manageListFunRef: manageListFun.toRef,
      selectRef: select.toRef,
      valueRef: value.toRef,
      labelRef: label.toRef,
      indexRef: index.toRef,
      listRef: listArr.toRef,
      ...props,
    }),
  );
}
