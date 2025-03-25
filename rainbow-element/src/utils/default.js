export function convertToCamelCase(str) {
  if (str.includes("-")) {
    const parts = str.split("-");
    const firstPart = parts[0];
    const remainingParts = parts
      .slice(1)
      .map((part) => part.charAt(0).toUpperCase() + part.slice(1));
    return firstPart + remainingParts.join("");
  }
  return str;
}

export function camelCaseToKebabCase(str) {
  return str.replace(/([a-z])([A-Z])/g, "$1-$2").toLowerCase();
}

export function isNum(d) {
  return typeof d === "number";
}
