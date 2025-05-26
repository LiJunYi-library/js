import { ref } from "../../proxy";

export function getListSelectProps(options = {}) {
  const config = {
    select: undefined,
    value: undefined,
    label: undefined,
    index: undefined,
    list: [],
    selectRef: ref,
    valueRef: ref,
    labelRef: ref,
    indexRef: ref,
    listRef: ref,
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
        item = args.list.find((el) => config.formatterLabel(el) === args.label);
        if (item !== undefined) return item;
      }
      if (args.index !== undefined) {
        item = args.list[args.index];
        if (item !== undefined) return item;
      }
      return undefined;
    },
    formatterList: (list) => list,
    cancelSame: false, // 是否取消相同的
    isMultiple: false, // 是否多选
    formRequired: false,
    formRequiredErrorMessage: "",
    validator: () => Promise.resolve(true),
    ...options,
  };
  return config;
}

export function listSelect(params) {}
