import { arrayFindIndex, arrayForcedTransform } from "@rainbow_ljy/rainbow-js";
import { proxy } from "../../proxy";
import { getListSelectProps } from "../select";

function getListRadioProps(props = {}) {
  const config = getListSelectProps({
    formatterSelect: (args = {}) => {
      let item;
      if (args.value !== undefined) {
        item = args.list.find((el) => config.formatterValue(el) === args.value);
        if (item !== undefined) return item;
      }
      if (args.label !== undefined) {
        item = args.list.find((el) => config.formatterLabel(el) === args.label);
        if (item !== undefined) return item;
      }
      if (args.index !== undefined) {
        item = args.list[args.index];
        if (item !== undefined) return item;
      }
      return undefined;
    },
    isMultiple: false,
    ...props,
  });
  return config;
}

export function listRadio(props = {}) {
  const config = getListRadioProps(props);
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
    return select.value === item;
  }

  async function onSelect(item) {
    if (config.cancelSame && same(item)) {
      reset();
      return false;
    }
    if (same(item)) return true;
    updateSelect(item);
    return false;
  }

  function reset() {
    select.value = undefined;
    value.value = undefined;
    label.value = undefined;
    index.value = undefined;
  }

  function updateSelect(val) {
    if (typeof val === "function") {
      select.value = list.value.find(val);
    } else {
      select.value = val;
    }
    value.value = formatterValue(select.value);
    label.value = formatterLabel(select.value);
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
    list.value = arrayForcedTransform(_list);
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
