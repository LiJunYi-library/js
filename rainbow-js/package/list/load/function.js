import { ref } from "../../proxy";
import { proxy } from "../../proxy";
import { listSelect } from "../select";
import { arrayForcedTransform } from "../../array";

function getListProps(props = {}) {
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
    formatterCurrentPage: (res, hooks) => {
      return hooks.currentPage + 1;
    },
    formatterFinished: (res, hooks) => {
      return hooks.list.length >= hooks.total;
    },
    formatterEmpty: (res, hooks) => {
      if (hooks.finished !== true) return false;
      return hooks.list.length === 0;
    },
    list: [],
    finished: false,
    empty: false,
    total: 0,
    currentPage: 1,
    pageSize: 10,
    isSelect: false,
    listRef: ref,
    finishedRef: ref,
    emptyRef: ref,
    totalRef: ref,
    currentPageRef: ref,
    pageSizeRef: ref,
    asyncHooks: {},
    ...props,
  };
  return config;
}

export function listLoad(props = {}) {
  const config = getListProps(props);
  const {
    formatterList,
    formatterTotal,
    formatterCurrentPage,
    formatterFinished,
    formatterEmpty,
    listRef,
    finishedRef,
    emptyRef,
    totalRef,
    currentPageRef,
    pageSizeRef,
    asyncHook,
  } = config;

  const list = listRef(config.list);
  const finished = finishedRef(config.finished);
  const empty = emptyRef(config.empty);
  const total = totalRef(config.total);
  const currentPage = currentPageRef(config.currentPage);
  const pageSize = pageSizeRef(config.pageSize);
  const selectHooks = listSelect(config);
  let loading = false;

  const hooks = proxy({
    list,
    ...selectHooks.getPrototype(),
    ...(asyncHook.getPrototype ? asyncHook.getPrototype() : asyncHook),
    finished,
    empty,
    total,
    currentPage,
    pageSize,
    continueAwaitSend,
    afreshNextBeginSend,
    afreshNextSend,
  });

  function onSuccess(res, callBack) {
    total.value = formatterTotal(res, hooks);
    const arr = arrayForcedTransform(formatterList(res, hooks));
    if (callBack) callBack(arr);
    list.value.push(...arr);
    finished.value = formatterFinished(res, hooks);
    empty.value = formatterEmpty(res, hooks);
    if (finished.value) return res;
    currentPage.value = formatterCurrentPage(res, hooks);
    return res;
  }

  async function continuePatch(length = 0, res, ...arg) {
    if (finished.value === true) return res;
    if (list.value.length - length >= pageSize.value) return res;
    res = await asyncHook.awaitSend(...arg).then(onSuccess);
    return continuePatch(length, res, ...arg);
  }

  async function continueAwaitSend(...arg) {
    if (finished.value === true) return Promise.reject("list load is finished");
    if (loading === true) return Promise.reject("list load is loadinged");
    loading = true;
    try {
      let res = await continuePatch(list.value.length, {}, ...arg);
      return res;
    } finally {
      loading = false;
    }
  }

  async function afreshPatch(res, ...arg) {
    if (finished.value === true) return res;
    if (list.value.length >= pageSize.value) return res;
    res = await asyncHook.awaitSend(...arg).then(onSuccess);
    return afreshPatch(res, ...arg);
  }

  async function afreshNextBeginSend(...arg) {
    list.value.splice(0);
    selectHooks.reset();
    currentPage.value = 1;
    finished.value = false;
    empty.value = false;
    total.value = 0;
    loading = true;
    try {
      let res = await asyncHook.nextBeginSend(...arg);
      onSuccess(res);
      res = await afreshPatch(res, ...arg);
      return res;
    } finally {
      loading = false;
    }
  }

  async function afreshNextSend(...arg) {
    currentPage.value = 1;
    finished.value = false;
    empty.value = false;
    total.value = 0;
    loading = true;
    try {
      let res = await asyncHook.nextSend(...arg);
      onSuccess(res, () => {
        list.value.splice(0);
        selectHooks.reset();
      });
      res = await afreshPatch(res, ...arg);
      return res;
    } finally {
      loading = false;
    }
  }

  return hooks;
}
