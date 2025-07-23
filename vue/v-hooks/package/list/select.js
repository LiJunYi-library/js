import { useRadio, useAsyncRadio } from "./radio";
import { useMultiple, useAsyncMultiple } from "./multiple";
import { ref } from "vue";
export { getSelectProps, useSelect, useAsyncSelect };

function getSelectProps(options = {}) {
  const config = {
    select: undefined,
    value: undefined,
    label: undefined,
    index: undefined,
    cancelSame: false, // 是否取消相同的
    isMultiple: false,
    formRequired: false,
    formRequiredErrorMessage: "",
    onChange: () => undefined,
    validator: () => Promise.resolve(true),
    formatterValue: (item) => item?.value,
    formatterLabel: (item) => item?.label,
    formatterDisabled: (item) => item?.disabled ?? false,
    formatterSelect: (args = {}) => {
      let item;
      if (args.value !== undefined) {
        item = args.list.find((el) => config.formatterValue(el) === args.value);
        if (item !== undefined) return item;
      }
      if (args.label !== undefined) {
        item = args.list.find((el) => config.findForLabel(el) === args.value);
        if (item !== undefined) return item;
      }
      if (args.index !== undefined) {
        item = args.list[args.index];
        if (item !== undefined) return item;
      }
      return undefined;
    },
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
  return config;
}

function useSelect(props = {}) {
  if (props.isMultiple) return useMultiple(props);
  return useRadio(props);
}

function useAsyncSelect(props = {}) {
  if (props.isMultiple) return useAsyncMultiple(props);
  return useAsyncRadio(props);
}
