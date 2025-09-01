import { useListRadio } from "../radio/index";
import { useListMultiple } from "../multiple/index";

export function useListSelect(props = {}) {
  if (props.isMultiple) return useListMultiple(props);
  return useListRadio(props);
}
