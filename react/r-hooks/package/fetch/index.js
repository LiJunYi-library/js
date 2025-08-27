import { fetchHOC } from "@rainbow_ljy/rainbow-js";
import { useMemo } from "react";
import { useMemoRef } from "../utils";

export function useFetchHOC(props = {}) {
  return function useFetch(config = {}) {
    const loading = useMemoRef();
    const begin = useMemoRef();
    const error = useMemoRef();
    const data = useMemoRef();
    const errorData = useMemoRef();
    return useMemo(() => {
      const hooks = fetchHOC(props)({
        loadingRef: loading.toRef,
        beginRef: begin.toRef,
        errorRef: error.toRef,
        dataRef: data.toRef,
        errorDataRef: errorData.toRef,
        ...config,
      });
      return hooks;
    }, []);
  };
}
