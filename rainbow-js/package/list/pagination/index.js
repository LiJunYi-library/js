import { ref } from "../../proxy";
import { proxy } from "../../proxy";
import { arrayForcedTransform } from "../../array";
import { listSelect } from "../select";

function getListPaginationProps(props = {}) {
  const config = {
    formatterList: (res, hooks) => {
      if (!res) return [];
      if (typeof res !== "object") return [];
      if (res instanceof Array) return res;
      return res.list || [];
    },
    formatterTotal: (res, hooks) => {
      if (!res) return 0;
      if (res instanceof Array) return res.length;
      return res.total * 1;
    },
    formatterEmpty: (res, hooks) => {
      return hooks.list.length === 0;
    },
    list: [],
    empty: false,
    total: 0,
    currentPage: 1,
    pageSize: 10,
    isSelect: false,
    listRef: ref,
    emptyRef: ref,
    totalRef: ref,
    currentPageRef: ref,
    pageSizeRef: ref,
    asyncHooks: {},
    ...props,
  };
  return config;
}

export function listPagination(props = {}) {
  const config = getListPaginationProps(props);
  const {
    formatterList,
    formatterTotal,
    formatterEmpty,
    listRef,
    emptyRef,
    totalRef,
    currentPageRef,
    pageSizeRef,
    asyncHook,
  } = config;

  const list = listRef(config.list);
  const empty = emptyRef(config.empty);
  const total = totalRef(config.total);
  const currentPage = currentPageRef(config.currentPage);
  const pageSize = pageSizeRef(config.pageSize);
  const selectHooks = listSelect(config);

  const hooks = proxy({
    ...selectHooks.getPrototype(),
    ...(asyncHook.getPrototype ? asyncHook.getPrototype() : asyncHook),
    list,
    empty,
    total,
    currentPage,
    pageSize,
    nextBeginSend,
    afreshNextBeginSend,
    nextSend,
    afreshNextSend,
  });

  async function nextBeginSend(options = {}, ...arg) {
    list.value.splice(0);
    let res = await asyncHook.nextBeginSend(options, ...arg);
    total.value = formatterTotal(res, hooks);
    const arr = arrayForcedTransform(formatterList(res, hooks));
    list.value.push(...arr);
    const updateListArg = options?.updateListArg || config.updateListArg;
    selectHooks.updateList(list.value, updateListArg);
    empty.value = formatterEmpty(res, hooks);
    return res;
  }

  async function afreshNextBeginSend(options = {}, ...arg) {
    currentPage.value = 1;
    total.value = 0;
    return nextBeginSend(options, ...arg);
  }

  async function nextSend(options = {}, ...arg) {
    let res = await asyncHook.nextSend(options, ...arg);
    total.value = formatterTotal(res, hooks);
    const arr = arrayForcedTransform(formatterList(res, hooks));
    list.value.splice(0);
    list.value.push(...arr);
    const updateListArg = options?.updateListArg || config.updateListArg;
    selectHooks.updateList(list.value, updateListArg);
    empty.value = formatterEmpty(res, hooks);
    return res;
  }

  async function afreshNextSend(options = {}, ...arg) {
    currentPage.value = 1;
    return nextSend(options, ...arg);
  }

  return hooks;
}
