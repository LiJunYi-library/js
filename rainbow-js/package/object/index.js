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


