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
