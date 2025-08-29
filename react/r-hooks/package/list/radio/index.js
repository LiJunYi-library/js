import { listRadio } from "@rainbow_ljy/rainbow-js";
import { useMemoRef, useOneceMemo } from "../../utils";

export function useListRadio(props = {}) {
  const select = useMemoRef();
  const value = useMemoRef();
  const label = useMemoRef();
  const index = useMemoRef();
  const list = useMemoRef();

  return useOneceMemo(() =>
    listRadio({
      selectRef: select.toRef,
      valueRef: value.toRef,
      labelRef: label.toRef,
      indexRef: index.toRef,
      listRef: list.toRef,
      ...props,
    }),
  );
}
