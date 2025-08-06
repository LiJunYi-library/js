export function isString(str) {
  return typeof str === "string";
}

export function stringIsUseful(str) {
  return isString(str) && str !== "";
}

export function stringUpperFirstCase(str) {
  if (!stringIsUseful(str)) return str;
  return str.charAt(0).toUpperCase() + str.slice(1);
}

export function stringLowerFirstCase(str) {
  if (!stringIsUseful(str)) return str;
  return str.charAt(0).toLowerCase() + str.slice(1);
}

export function stringKebabCaseToCamelCase(str) {
  if (!stringIsUseful(str)) return str;
  return str.replace(/-([a-z])/g, (_, letter) => letter.toUpperCase());
}

export function stringCamelCaseToKebabCase(str) {
  if (!stringIsUseful(str)) return str;
  return str.replace(/([a-z])([A-Z])/g, "$1-$2").toLowerCase();
}
