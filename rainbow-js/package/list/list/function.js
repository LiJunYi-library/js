//
//
export function list(props = {}) {
  const listData = listRef(arrayForcedTransform(config.list));

  const selectHooks = useSelect({ ...props, list: resolveList() });

  function resolveList(...args) {
    let arr = listData.value;
    if (this.filterFun) arr = arr.filter(this.filterFun);
    if (this.sortFun) arr = arr.sort(this.sortFun);
    arr = arrayPaging(arr, this.currentPage, this.pageSize);
    return arr;
    // selectHooks.updateList(arr, ...args);
  }
}
