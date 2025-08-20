import { arrayForcedTransform, arrayRemoves } from "../../array";
import { listSelect } from "../select";
import { ref } from "../../proxy";
import { proxy } from "../../proxy";

function getListProps(props = {}) {
  const config = {
    currentPage: 1,
    pageSize: -1,
    total: 0,
    listData: [],
    filterFun: undefined,
    sortFun: undefined,
    manageListFun: undefined,
    list: [],
    currentPageRef: ref,
    pageSizeRef: ref,
    totalRef: ref,
    listDataRef: ref,
    filterFunRef: ref,
    sortFunRef: ref,
    manageListFunRef: ref,
    filterList: (args = {}) => {
      let arr = [...arrayForcedTransform(args.listData)];
      if (args.manageListFun) arr = args.manageListFun(arr, args);
      if (args.filterFun) arr = arr.filter(args.filterFun);
      if (args.sortFun) arr = arr.sort(args.sortFun);
      args.total = arr.length;
      (() => {
        if (args.pageSize <= 0) return;
        let currentPage = args.currentPage;
        let pageSize = args.pageSize;
        let maxPage = Math.ceil(args.total / pageSize) || 1;
        if (currentPage > maxPage) {
          args.currentPage = maxPage;
          currentPage = maxPage;
        }
        const b = (currentPage - 1) * pageSize;
        const e = currentPage * pageSize;
        arr = arr.slice(b, e);
      })();
      return arr;
    },
    ...props,
  };
  config.listData = config.list;
  config.total = config.listData.length;
  return config;
}

export function list(props = {}) {
  const config = getListProps(props);
  const {
    listDataRef,
    pageSizeRef,
    totalRef,
    currentPageRef,
    filterFunRef,
    sortFunRef,
    manageListFunRef,
    filterList,
  } = config;

  const initList = filterList(config);
  const listData = listDataRef(arrayForcedTransform(config.list));
  const pageSize = pageSizeRef(config.pageSize);
  const currentPage = currentPageRef(config.currentPage);
  const total = totalRef(config.total);
  const filterFun = filterFunRef(config.filterFun);
  const sortFun = sortFunRef(config.sortFun);
  const manageListFun = manageListFunRef(config.sortFun);
  const selectHooks = listSelect({ ...props, list: initList });

  const hooks = proxy({
    ...selectHooks.getPrototype(),
    listData,
    pageSize,
    currentPage,
    total,
    filterFun,
    sortFun,
    manageListFun,
    push,
    pushed,
    unshift,
    unshifted,
    splice,
    spliced,
    insert,
    inserted,
    pop,
    shift,
    remove,
    removed,
    changeIndex,
    change,
    filter,
    manageList,
    sort,
    ascendingOrder,
    descendingOrder,
    updateCurrentPage,
    updatePageSize,
    updateList,
    resolveList,
  });

  function resolveList(...args) {
    // let arr = [...arrayForcedTransform(listData.value)];
    // if (filterFun.value) arr = arr.filter(filterFun.value);
    // if (sortFun.value) arr = arr.sort(sortFun.value);
    // total.value = arr.length;
    // (() => {
    //   if (pageSize.value <= 0) return;
    //   let size = pageSize.value;
    //   let page = currentPage.value;
    //   let maxPage = Math.ceil(total.value / size) || 1;
    //   if (page > maxPage) {
    //     console.log("更换 currentPage");
    //     page = maxPage;
    //     currentPage.value = maxPage;
    //   }
    //   const b = (currentPage.value - 1) * pageSize.value;
    //   const e = currentPage.value * pageSize.value;
    //   arr = arr.slice(b, e);
    // })();
    let arr = filterList(hooks);
    selectHooks.updateList(arr, ...args);
  }

  function push(...args) {
    listData.value.push(...args);
    resolveList("value");
  }

  function pushed(items = [], args = "value") {
    listData.value.push(...items);
    resolveList(args);
  }

  function unshift(...args) {
    listData.value.unshift(...args);
    resolveList("value");
  }

  function unshifted(items = [], args = "value") {
    listData.value.unshift(...items);
    resolveList(args);
  }

  function _splice(i, deleteCount, ...items) {
    let start;
    if (i instanceof Function) {
      start = listData.value.findIndex(i);
      if (start === -1) return;
    } else start = i;
    listData.value.splice(start, deleteCount, ...items);
  }

  function splice(...args) {
    _splice(...args);
    resolveList("value");
  }

  function spliced(start, deleteCount, items = [], args = "value") {
    _splice(start, deleteCount, ...items);
    resolveList(args);
  }

  function _insert(item, index = 0, deleteCount, ...items) {
    let fn;
    if (item instanceof Function) fn = item;
    else fn = (el) => el === item;
    const start = listData.value.findIndex(fn) + index;
    if (start === -1) return;
    listData.value.splice(start, deleteCount, ...items);
  }

  function insert(item, index = 0, deleteCount, ...items) {
    _insert(item, index, deleteCount, ...items);
    resolveList("value");
  }

  function inserted(item, index = 0, deleteCount, items = [], args = "value") {
    _insert(item, index, deleteCount, ...items);
    resolveList(args);
  }

  function pop(args = "value") {
    listData.value.pop();
    resolveList(args);
  }

  function shift(args = "value") {
    listData.value.shift();
    resolveList(args);
  }

  function remove(...items) {
    arrayRemoves(listData.value, ...items);
    resolveList("value");
  }

  function removed(items = [], args = "value") {
    arrayRemoves(listData.value, ...items);
    resolveList(args);
  }

  function change(item1, item2, args = "value") {
    const index1 = listData.value.indexOf(item1);
    const index2 = listData.value.indexOf(item2);
    if (index1 === -1 || index2 === -1) return;
    listData.value[index1] = item2;
    listData.value[index2] = item1;
    resolveList(args);
  }

  function changeIndex(index1, index2, args = "value") {
    const item1 = listData.value[index1];
    const item2 = listData.value[index2];
    listData.value[index1] = item2;
    listData.value[index2] = item1;
    resolveList(args);
  }

  function filter(fun, args = "value") {
    filterFun.value = fun;
    resolveList(args);
  }

  function manageList(fun, args = "value") {
    manageListFun.value = fun;
    resolveList(args);
  }

  function sort(fun, args = "value") {
    sortFun.value = fun;
    resolveList(args);
  }

  function ascendingOrder(formatter, args = "value") {
    sortFun.value = (a, b) => formatter(a) - formatter(b);
    resolveList(args);
  }

  function descendingOrder(formatter, args = "value") {
    sortFun.value = (a, b) => formatter(b) - formatter(a);
    resolveList(args);
  }

  function updateCurrentPage(val, args = "value") {
    currentPage.value = val;
    resolveList(args);
  }

  function updatePageSize(val, args = "value") {
    pageSize.value = val;
    resolveList(args);
  }

  function updateList(_list = [], args = "value") {
    listData.value = arrayForcedTransform(_list);
    resolveList(args);
  }

  return hooks;
}
