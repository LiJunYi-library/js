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
  return !Object.keys(object).length;
}

export function objectEqualitys(o1 = {}, o2 = {}) {
  for (const key in o1) {
    if (o1[key] !== o2[key]) return false;
  }
  return true;
}

export function objectParseUri(url = "", object) {
  if (!object) return "";
  if (typeof object !== "object") return object;
  if (!Object.keys(object).length) return "";
  let str = "";
  for (const key in object) {
    if (Object.hasOwnProperty.call(object, key)) {
      let element = object[key];
      if (typeof element === "object") {
        if (element instanceof Array) element = element.toString();
        else element = JSON.stringify(element);
      }
      if (element === undefined) continue;
      if (element + "" === "NaN") element = null;
      str += `${key}=${element}&`;
    }
  }
  str = str.slice(0, -1);
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
