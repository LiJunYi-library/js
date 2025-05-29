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
  // const selectHooks = listSelect({ ...props });

  const hooks = proxy({
    // ...selectHooks.getPrototype(),
    ...(asyncHook.getPrototype ? asyncHook.getPrototype() : asyncHook),
    list,
    finished,
    empty,
    total,
    currentPage,
    pageSize,
    awaitConcatSend,
    nextBeginSend,
  });

  function onSuccess(res) {
    total.value = formatterTotal(res, hooks);
    const arr = arrayForcedTransform(formatterList(res, hooks));
    list.value.push(...arr);
    finished.value = formatterFinished(res, hooks);
    empty.value = formatterEmpty(res, hooks);
    if (finished.value) return res;
    currentPage.value = formatterCurrentPage(res, hooks);
    return res;
  }

  function awaitConcatSend(...arg) {
    if (finished.value === true) return Promise.reject("finished");
    return asyncHook.awaitSend(...arg).then(onSuccess);
  }

  async function nextBeginSend(...arg) {
    list.value.splice(0);
    currentPage.value = 1;
    finished.value = false;
    empty.value = false;
    total.value = 0;
    return asyncHook.nextBeginSend(...arg).then(onSuccess);
  }

  return hooks;
}
