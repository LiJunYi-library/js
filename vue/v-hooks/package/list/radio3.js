import { ref, watch } from "vue";
import { usePromise2, useLoading } from "../promise";
import { getSelectProps } from "./select";
import { useReactive } from "../../other";

export { useRadio3, useAsyncRadio3 };

function useRadio3(props = {}) {
  const config = getSelectProps(props);
  const { formatterValue, formatterLabel, formatterDisabled ,formatterSelect} = config;
  const findForValue = (val) => (el) => config.formatterValue(el) === val;
  const findForLabel = (val) => (el) => config.formatterLabel(el) === val;
  const findIndex = (arr = [], item) => {
    const i = arr.findIndex((val) => val === item);
    return i < 0 ? undefined : i;
  };

  const list = ref(config.list);
  const select = ref(formatterSelect(config));
  const value = ref(formatterValue(select.value));
  const label = ref(formatterLabel(select.value));
  const index = ref(findIndex(list.value, select.value));

  const params = useReactive({
    list,
    select,
    value,
    label,
    index,
    formatterValue,
    formatterLabel,
    formatterDisabled,
    //
    onSelect,
    same,
    reset,
    updateList,
    updateValue,
    updateIndex,
    updateLabel,
    updateSelect,
    //
    getSelectOfValue,
    getLabelOfValue,
    getIndexOfValue,
    //
    someValue,
    someSelect,
    resolveValue,
    resolveSelect,
    updateListToResolveValue,
    updateListAndReset,
    //
    copy,
    copyOf,
    copyTo,
  });

  function same(item, i) {
    return select.value === item;
  }

  function onSelect(item, i) {
    if (!config.validator(params)) return;
    if (config.cancelSame && same(item, i)) {
      select.value = undefined;
      index.value = undefined;
      label.value = undefined;
      value.value = undefined;
      config.onChange(params);
      return false;
    }
    if (same(item, i)) return true;
    select.value = item;
    index.value = i;
    label.value = formatterLabel(item);
    value.value = formatterValue(item);
    config.onChange(params);
    return false;
  }

  function reset() {
    select.value = undefined;
    value.value = undefined;
    label.value = undefined;
    index.value = undefined;
  }

  function updateValue(val) {
    value.value = val;
    select.value = list.value.find?.(findForValue(val));
    label.value = formatterLabel(select.value);
    index.value = findIndex(list.value, select.value);
  }

  function updateLabel(val) {
    label.value = val;
    select.value = list.value.find(findForLabel(label.value));
    value.value = formatterValue(select.value);
    index.value = findIndex(list.value, select.value);
  }

  function updateIndex(val) {
    index.value = val;
    select.value = list.value[val];
    value.value = formatterValue(select.value);
    label.value = formatterLabel(select.value);
  }

  function updateSelect(val) {
    if (typeof val === "function") {
      select.value = list.value.find(val);
    } else {
      select.value = val;
    }
    index.value = findIndex(list.value, select.value);
    value.value = formatterValue(select.value);
    label.value = formatterLabel(select.value);
  }

  function updateList(l = [], args = {}) {
    list.value = l;
    if (typeof args === "function") {
      select.value = args();
    } else {
      select.value = formatterSelect({ ...config, list: l, ...args });
    }
    value.value = formatterValue(select.value);
    label.value = formatterLabel(select.value);
    index.value = findIndex(list.value, select.value);
  }
  /***
   *
   */
  function getSelectOfValue(val) {
    return list.value.find?.(findForValue(val));
  }

  function getLabelOfValue(val) {
    return formatterLabel(getSelectOfValue(val));
  }

  function getIndexOfValue(val) {
    return findIndex(list.value, getSelectOfValue(val));
  }
  /**
   *
   ***/
  function someValue(val = value.value) {
    return list.value.some(findForValue(val));
  }

  function someSelect(item = select.value) {
    return list.value.some((el) => el === item);
  }

  function resolveValue(val = value.value) {
    if (someValue(val)) updateValue(val);
    else reset();
  }

  function resolveSelect(li = []) {
    list.value = li;
    if (!someSelect(select.value)) reset();
  }

  function updateListAndReset(li = []) {
    list.value = li;
    reset();
  }

  /**
   *
   */
  function copy() {
    let c = useRadio3(props);
    c.list = list.value;
    c.select = select.value;
    c.value = value.value;
    c.label = label.value;
    c.index = index.value;
    return c;
  }

  function copyOf(target) {
    list.value = target.list;
    select.value = target.select;
    value.value = target.value;
    label.value = target.label;
    index.value = target.index;
  }

  function copyTo(target) {
    target.list = list.value;
    target.select = select.value;
    target.value = value.value;
    target.label = label.value;
    target.index = index.value;
  }

  return params;
}

function useAsyncRadio3(props = {}) {
  const config = {
    watchDataCb: ({ data, updateList }) => {
      updateList(data);
    },
    fetchCb: () => undefined,
    ...props,
  };
  const radioHooks = useRadio3(config);
  const asyncHooks = config.asyncHooks || usePromise2(config.fetchCb, { ...config });
  let loadingHooks = {};
  if (config.loadingHooks) {
    loadingHooks = useLoading({
      loadingHook: config.loadingHooks,
      promiseHook: asyncHooks,
    });
  }

  const params = useReactive({
    ...radioHooks?.getProto?.(),
    ...asyncHooks?.getProto?.(),
    ...loadingHooks?.getProto?.(),
  });

  watch(
    () => asyncHooks.data,
    (data) => {
      config.watchDataCb(params, data);
    },
  );

  return params;
}
