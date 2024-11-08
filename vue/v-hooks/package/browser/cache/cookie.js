import { ref, watch, isRef, } from "vue";
import { useLocalStorageRef } from "./localStorage";
/**
 * 
 * @param  {...any} arg 
 * @returns 
 * const token = useCookie({ key: 'token', cookieAttributes: {domain: 'd2.com'  } });
 * const token = useCookie('token', 'jk )
 */
export function useCookie(...arg) {
  if (arg.length === 1) return handleCookie(arg[0]);
  const [key, defaultValue] = arg;
  return handleCookie({ key, defaultValue });
}

function handleCookie({ key, defaultValue, cookieAttributes = {}, onChange }) {
  const cookies = parseCookie(document.cookie);
  const cookieVal = (() => {
    const cV = cookies[key];
    if (cV === undefined) {
      setCookie(JSON.stringify(defaultValue));
      return defaultValue;
    }
    if (cV === "undefined") return undefined;
    return JSON.parse(cV);
  })();
  const storage = useLocalStorageRef(key, defaultValue, { onChange: onListener });

  function setCookie(value) {
    const attrs = { ...cookieAttributes, key, value }
    const cookieStr = [
      `${attrs.key}=${attrs.value}`,
      attrs.domain && `domain=${attrs.domain}`,
      attrs.path && `path=${attrs.path}`,
      attrs.maxAge && `max-age=${attrs.maxAge}`,
      attrs.secure && 'secure',
      attrs.sameSite && `SameSite=${attrs.sameSite};`
    ].filter(Boolean).join(';');
    document.cookie = cookieStr;
  }

  const val = ref(cookieVal);

  function onListener(event) {
    val.value = event._r_value;
    if (onChange) onChange(event);
  }

  watch(val, (newValue) => {
    const newVal = isRef(newValue) ? newValue.value : newValue;
    storage.value = newVal;
    setCookie(JSON.stringify(newVal));
  }, { deep: true });

  return val;
}



function parseCookie(cookieString) {
  const cookies = {};
  const cookiePairs = cookieString.split(";");
  for (const pair of cookiePairs) {
    const [name, value] = pair.trim().split("=");
    cookies[name] = decodeURIComponent(value);
  }
  return cookies;
}
