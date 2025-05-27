import { arrayFindIndexs, arrayForcedTransform, arrayRemove } from "@rainbow_ljy/rainbow-js";
import { proxy } from "../../proxy";
import { getListSelectProps } from "../select";

function arrayFinds(array = [], vals = [], fn) {
  return vals.map((val) => array.find((el) => fn(el) === val)).filter((el) => el !== undefined);
}

function getListMultipleProps(props = {}) {
  const config = getListSelectProps({
    formatterSelect: (args = {}) => {
      let item = [];
      if (args.value !== undefined) {
        item = arrayFinds(args.list, args.value, config.formatterValue);
        if (item.length) return item;
      }
      if (args.label !== undefined) {
        item = arrayFinds(args.list, args.label, config.formatterLabel);
        if (item.length) return item;
      }
      if (args.index !== undefined) {
        item = args.index.map((el) => args.list[el]);
        if (item.length) return item;
      }
      return [];
    },
    isMultiple: true,
    ...props,
  });
  return config;
}

export function listMultiple(props = {}) {
  const config = getListMultipleProps(props);
  const {
    formatterValue,
    formatterLabel,
    formatterDisabled,
    formatterSelect,
    selectRef,
    valueRef,
    labelRef,
    indexRef,
    listRef,
  } = config;
  const list = listRef(arrayForcedTransform(config.list));
  const select = selectRef(formatterSelect(config));
  const value = valueRef(select.value.map(formatterValue));
  const label = labelRef(select.value.map(formatterLabel));
  const index = indexRef(arrayFindIndexs(list.value, select.value));

  const findForValue = (vals) => arrayFinds(list.value, vals, formatterValue);
  const findForLabel = (vals) => arrayFinds(list.value, vals, formatterLabel);

  function same(item) {
    return select.value.some((val) => val === item);
  }

  async function onSelect(item) {
    if (same(item)) {
      arrayRemove(select.value, item);
      updateSelect(select.value);
    } else {
      select.value.push(item);
      updateSelect(select.value);
    }
    return false;
  }

  function reset() {
    select.value = [];
    value.value = [];
    label.value = [];
    index.value = [];
  }

  function updateSelect(val = []) {
    if (typeof val === "function") {
      select.value = arrayForcedTransform(list.value.filter(val));
    } else {
      select.value = arrayForcedTransform(val);
    }
    value.value = select.value.map(formatterValue);
    label.value = select.value.map(formatterLabel);
    index.value = arrayFindIndexs(list.value, select.value);
  }

  function updateValue(val) {
    value.value = arrayForcedTransform(val);
    select.value = findForValue(value.value);
    label.value = select.value.map(formatterLabel);
    index.value = arrayFindIndexs(list.value, select.value);
  }

  function updateLabel(val) {
    label.value = arrayForcedTransform(val);
    select.value = findForLabel(label.value);
    value.value = select.value.map(formatterValue);
    index.value = arrayFindIndexs(list.value, select.value);
  }

  function updateIndex(val) {
    index.value = arrayForcedTransform(val);
    select.value = index.value.map((el) => list.value?.[el]).filter((el) => el !== undefined);
    value.value = select.value.map(formatterValue);
    label.value = select.value.map(formatterLabel);
  }

  function updateList(_list = [], args) {
    list.value = arrayForcedTransform(_list);
    select.value = (() => {
      if (typeof args === "function") return args();
      if (args === true) return formatterSelect({ ...config, list: list.value });
      if (args === "value") return formatterSelect({ list: list.value, value: value.value });
      if (args === "label") return formatterSelect({ list: list.value, label: label.value });
      if (args === "index") return formatterSelect({ list: list.value, index: index.value });
      return formatterSelect({ ...args, list: list.value });
    })();
    value.value = select.value.map(formatterValue);
    label.value = select.value.map(formatterLabel);
    index.value = arrayFindIndexs(list.value, select.value);
  }

  function getSelectOfValue(val) {
    return findForValue(arrayForcedTransform(val));
  }

  function getLabelOfValue(val) {
    return getSelectOfValue(val).map(formatterLabel);
  }

  function getIndexOfValue(val) {
    return arrayFindIndexs(list.value, getSelectOfValue(val));
  }

  return proxy({
    value,
    label,
    index,
    select,
    list,
    same,
    reset,
    onSelect,
    formatterValue,
    formatterLabel,
    formatterDisabled,
    updateSelect,
    updateValue,
    updateLabel,
    updateIndex,
    updateList,
    getSelectOfValue,
    getLabelOfValue,
    getIndexOfValue,
  });
}
