import { arrayFindIndex, arrayForcedTransform } from "@rainbow_ljy/rainbow-js";
import { proxy } from "../../proxy";
import { getListSelectProps } from "../select";

export function listMultiple(props = {}) {
  const config = getListSelectProps(props);
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
  const valuePredicate = (val) => (el) => formatterValue(el) === val;
  const labelPredicate = (val) => (el) => formatterLabel(el) === val;

  const list = listRef(arrayForcedTransform(config.list));
  const select = selectRef(formatterSelect(config));
  const value = valueRef(formatterValue(select.value));
  const label = labelRef(formatterLabel(select.value));
  const index = indexRef(arrayFindIndex(list.value, select.value));

  const findForValue = (val) => list.value.find?.(valuePredicate(val));
  const findForLabel = (val) => list.value.find?.(labelPredicate(val));

  function same(item) {
    return select.value.some((val) => val === item);
  }

  async function onSelect(item) {
    if (same(item)) {
    }
    // updateSelect(item);
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
    index.value = arrayFindIndex(list.value, select.value);
  }

  function updateValue(val) {
    value.value = val;
    select.value = findForValue(value.value);
    label.value = formatterLabel(select.value);
    index.value = arrayFindIndex(list.value, select.value);
  }

  function updateLabel(val) {
    label.value = val;
    select.value = findForLabel(label.value);
    value.value = formatterValue(select.value);
    index.value = arrayFindIndex(list.value, select.value);
  }

  function updateIndex(val) {
    index.value = val;
    select.value = list.value[val];
    value.value = formatterValue(select.value);
    label.value = formatterLabel(select.value);
  }

  function updateList(_list = [], args) {
    list.value = arrayForcedTransform(list);
    console.log(list.value);
    select.value = (() => {
      if (typeof args === "function") return args();
      if (args === true) return formatterSelect({ ...config, list: list.value });
      if (args === "value") return formatterSelect({ list: list.value, value: value.value });
      if (args === "label") return formatterSelect({ list: list.value, label: label.value });
      if (args === "index") return formatterSelect({ list: list.value, index: index.value });
      return formatterSelect({ ...args, list: list.value });
    })();
    value.value = formatterValue(select.value);
    label.value = formatterLabel(select.value);
    index.value = arrayFindIndex(list.value, select.value);
  }

  function getSelectOfValue(val) {
    return findForValue(val);
  }

  function getLabelOfValue(val) {
    return formatterLabel(getSelectOfValue(val));
  }

  function getIndexOfValue(val) {
    return arrayFindIndex(list.value, getSelectOfValue(val));
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
