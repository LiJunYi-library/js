import { promiseAbortController } from "@rainbow_ljy/rainbow-js";
import { useMemoRef, useOneceMemo } from "../utils";

export function usePromise(fn, props = {}) {
  const loading = useMemoRef();
  const begin = useMemoRef();
  const error = useMemoRef();
  const data = useMemoRef();
  const errorData = useMemoRef();

  return useOneceMemo(() =>
    promiseAbortController(fn, {
      loadingRef: loading.toRef,
      beginRef: begin.toRef,
      errorRef: error.toRef,
      dataRef: data.toRef,
      errorDataRef: errorData.toRef,
      ...props,
    }),
  );
}
