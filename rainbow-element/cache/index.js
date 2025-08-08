import { ref, proxy } from "@rainbow_ljy/rainbow-js";

function useLocalStorageRef(props) {
  const config = {
    key: undefined,
    defaultValue: undefined,
    valueRef: ref,
    // ...props,
  };

  let defaultValue = config.defaultValue;
  const localVal = window.localStorage.getItem(config.key);
  if (localVal !== null) {
    try {
    } catch (error) {}
  }
  const val = config.valueRef(defaultValue);

  return {
    get value() {
      return val.value;
    },
    set value(v) {
      val.value = v;
    },
  };
}

import { customRef } from "vue";

export function useLocalVal(key, defaultValue) {
  let value;

  const localVal = window.localStorage.getItem(key);

  if (localVal === null) {
    value = defaultValue;
    window.localStorage.setItem(key, JSON.stringify(defaultValue));
  } else {
    try {
      value = JSON.parse(localVal);
    } catch (error) {
      value = localVal;
    }
  }

  return customRef((track, trigger) => {
    return {
      get() {
        track();
        const localVal = window.localStorage.getItem(key);
        if (localVal === null) return defaultValue;
        try {
          return JSON.parse(localVal);
        } catch (error) {
          return localVal;
        }
      },
      set(newValue) {
        window.localStorage.setItem(key, JSON.stringify(newValue));
        trigger();
      },
    };
  });
}
