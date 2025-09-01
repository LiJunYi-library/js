import { listMultiple } from "@rainbow_ljy/rainbow-js";
import { useMemoRef, useOneceMemo } from "../../utils";

export function useListMultiple(props = {}) {
  const select = useMemoRef();
  const value = useMemoRef();
  const label = useMemoRef();
  const index = useMemoRef();
  const list = useMemoRef();

  return useOneceMemo(() =>
    listMultiple({
      selectRef: select.toRef,
      valueRef: value.toRef,
      labelRef: label.toRef,
      indexRef: index.toRef,
      listRef: list.toRef,
      ...props,
    }),
  );
}
