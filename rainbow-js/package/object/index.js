export function objectFilter(object = {}, regExp, isDelete) {
  const o = {};
  for (const key in object) {
    if (object.hasOwnProperty.call(object, key)) {
      const element = object[key];
      if (regExp.test(key)) {
        const pro = key.replace(regExp, "");
        o[pro] = element;
        if (isDelete) delete object[key];
      }
    }
  }
  return o;
}

export function objectIsEmpty(object) {
  if (!object) return false;
  return Boolean(Object.keys(object).length);
}

export function objectEqualitys(o1 = {}, o2 = {}) {
  for (const key in o1) {
    if (o1[key] !== o2[key]) return false;
  }
  return true;
}

export function objectParseUri(url = "", object) {
  if (typeof object !== "object") return "";
  if (!objectIsEmpty(object)) return "";
  const params = new URLSearchParams();
  objectForIn(object, (item, key) => {
    if (item === undefined) return;
    if (typeof item === "object" && !(item instanceof Array)) item = JSON.stringify(item);
    params.set(key, item);
  });
  const str = params.toString() || ''
  if (url && url.includes("?")) return `&${str}`;
  return `?${str}`;
}

export function objectParseFormData(object, bool) {
  const formData = new FormData();
  for (const key in object) {
    if (Object.prototype.hasOwnProperty.call(object, key)) {
      if (bool && object[key] !== undefined) formData.append(key, object[key]);
    }
  }
  return formData;
}

export function objectJSONParse(...arg) {
  try {
    return JSON.parse(...arg);
  } catch (error) {
    return {};
  }
}

export function objectJSONStringify(...arg) {
  try {
    return JSON.stringify(...arg);
  } catch (error) {
    return "";
  }
}

export function objectAssign(o1, o2, keys = []) {
  for (const key in o2) {
    if (keys.includes(key)) o1[key] = o2[key];
  }
  return o1;
}

export function objectClear(obj) {
  if (typeof obj !== "object" || obj === null) return;
  Object.keys(obj).forEach((key) => {
    delete obj[key];
  });
}

export function objectIncludes(obj, key) {
  return Object.keys(obj).includes(key);
}

export function objectForIn(params = {}, fmt) {
  if (!params) return;
  for (const key in params) {
    if (Object.prototype.hasOwnProperty.call(params, key)) {
      fmt(params[key], key, params);
    }
  }
}

export function objectForMap(params = {}, fmt) {
  const o = {};
  if (!params) return o;
  forIn(params, (item, key) => {
    o[key] = fmt(item, key, params);
  });
  return o;
}
