import { arrayForcedTransform, arrayRemoves } from "@rainbow_ljy/rainbow-js";
import { listSelect } from "../select";
import { ref } from "../../proxy";
import { proxy } from "../../proxy";

function getListProps(props = {}) {
  const config = {
    currentPage: 1,
    pageSize: 10,
    filterFun: undefined,
    sortFun: undefined,
    list: [],
    listDataRef: ref,
    currentPageRef: ref,
    pageSizeRef: ref,
    filterFunRef: ref,
    sortFunRef: ref,
    totalRef: ref,
    formatterList: (args = {}) => {
      let arr = arrayForcedTransform(args.listData);
      if (args.filterFun) arr = arr.filter(args.filterFun);
      if (args.sortFun) arr = arr.sort(args.sortFun);
      let currentPage = args.currentPage;
      let pageSize = args.pageSize;
      let maxPage = Math.ceil(args.listData.length / pageSize) || 1;
      if (currentPage > maxPage) currentPage = maxPage;
      const b = (currentPage - 1) * pageSize;
      const e = currentPage * pageSize;
      arr = arr.slice(b, e);
      return arr;
    },
    ...props,
  };
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
    formatterList,
  } = config;
  const getCurrentPage = (args) => {
    let pageSize = args.pageSize;
    let currentPage = args.currentPage;
    let maxPage = Math.ceil(args.list.length / pageSize) || 1;
    if (currentPage > maxPage) currentPage = maxPage;
    return currentPage;
  };

  const listData = listDataRef(arrayForcedTransform(config.list));
  const pageSize = pageSizeRef(config.pageSize);
  const currentPage = currentPageRef(getCurrentPage(config));
  const filterFun = filterFunRef(config.filterFun);
  const sortFun = sortFunRef(config.sortFun);
  const total = totalRef(listData.value.length);

  const selectHooks = listSelect({
    ...props,
    list: formatterList({ ...config, listData: listData.value, currentPage: currentPage.value }),
  });

  function resolveList(...args) {
    let arr = [...arrayForcedTransform(listData.value)];
    if (filterFun.value) arr = arr.filter(filterFun.value);
    if (sortFun.value) arr = arr.sort(sortFun.value);
    total.value = arr.length;
    const b = (currentPage.value - 1) * pageSize.value;
    const e = currentPage.value * pageSize.value;
    arr = arr.slice(b, e);
    selectHooks.updateList(arr, ...args);
  }

  function push(...args) {
    listData.value.push(...args);
    resolveList("value");
  }

  function add(items = [], args = "value") {
    listData.value.push(...arrayForcedTransform(items));
    resolveList(args);
  }

  function unshift(...args) {
    listData.value.unshift(...args);
    resolveList("value");
  }

  function increase(items = [], args = "value") {
    listData.value.unshift(...arrayForcedTransform(items));
    resolveList(args);
  }

  function splice(...args) {
    listData.value.splice(...args);
    resolveList("value");
  }

  function insert(start, deleteCount, items = [], args = "value") {
    listData.value.splice(start, deleteCount, ...items);
    resolveList(args);
  }

  function pop(args = "value") {
    const item = selectHooks.list.at(-1);
    expurgate([item], args);
  }

  function shift(args = "value") {
    const item = selectHooks.list.at(0);
    expurgate([item], args);
  }

  function remove(...items) {
    listData.value = listData.value.filter((el) => !items.includes(el));
    resolveList("value");
  }

  function expurgate(items = [], args = "value") {
    listData.value = listData.value.filter((el) => !items.includes(el));
    resolveList(args);
  }

  function filter(fun, args = "value") {
    filterFun.value = fun;
    resolveList(args);
  }

  function sort(fun, args = "value") {
    sortFun.value = fun;
    resolveList(args);
  }

  function updateCurrentPage(val, args = "value") {
    currentPage.value = val;
    resolveList(args);
  }

  return proxy({
    ...selectHooks.getPrototype(),
    listData,
    pageSize,
    currentPage,
    total,
    push,
    add,
    unshift,
    increase,
    splice,
    insert,
    pop,
    shift,
    remove,
    expurgate,
    filter,
    sort,
    updateCurrentPage,
  });
}
