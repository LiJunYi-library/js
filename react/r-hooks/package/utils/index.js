import { useState, useMemo, useRef } from "react";

export function ref(state) {
  const [, dispatch] = useState(state);
  const cacheRef = useRef(state);
  return useMemo(() => {
    return {
      __v_isRef: true,
      set value(val) {
        cacheRef.current = val;
        dispatch(val);
      },
      get value() {
        return cacheRef.current;
      },
      toRef(value) {
        cacheRef.current = value;
        return {
          __v_isRef: true,
          set value(val) {
            cacheRef.current = val;
            dispatch(val);
          },
          get value() {
            return cacheRef.current;
          },
        };
      },
    };
  }, []);
}

export function useMemoRef() {
  const [, dispatch] = useState();
  const cacheRef = useRef();
  return useMemo(() => {
    return {
      get value() {
        return cacheRef.current;
      },
      toRef(value) {
        cacheRef.current = value;
        return {
          __v_isRef: true,
          set value(val) {
            cacheRef.current = val;
            dispatch(val);
          },
          get value() {
            return cacheRef.current;
          },
        };
      },
    };
  }, []);
}

export function renderSlot(slots, name, props, defNode) {
  const vNode = slots?.[name];
  if (vNode instanceof Function) return vNode(props);
  if (vNode) return vNode;
  if (defNode instanceof Function) return defNode(props);
  return defNode;
}
