import { useRadio, useAsyncRadio } from "./radio";
import { useMultiple, useAsyncMultiple } from "./multiple";
import { ref } from "vue";
export { getSelectProps, useSelect, useAsyncSelect };

function getSelectProps(options = {}) {
  return {
    select: undefined,
    value: undefined,
    label: undefined,
    index: undefined,
    cancelSame: false, // 是否取消相同的
    isMultiple: false,
    formRequired: false,
    formRequiredErrorMessage: '',
    onChange: () => undefined,
    validator: () => Promise.resolve(true),
    formatterValue: (item) => item?.value,
    formatterLabel: (item) => item?.label,
    formatterDisabled: (item) => item?.disabled ?? false,
    formatterList: (list) => list,
    listRef: ref,
    selectRef: ref,
    valueRef: ref,
    labelRef: ref,
    indexRef: ref,
    priority: "valueItem", // 优先使用的 valueItem || indexItem || labelItem || none
    ...options,
    list: options.list || [],
  };
}

function useSelect(props = {}) {
  if (props.isMultiple) return useMultiple(props);
  return useRadio(props);
}

function useAsyncSelect(props = {}) {
  if (props.isMultiple) return useAsyncMultiple(props);
  return useAsyncRadio(props);
}
