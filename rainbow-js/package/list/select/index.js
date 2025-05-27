import { ref } from "../../proxy";
import { listRadio } from "../radio";
import { listMultiple } from "../multiple";

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

export function listSelect(props = {}) {
  if (props.isMultiple) return listMultiple(props);
  return listRadio(props);
}
