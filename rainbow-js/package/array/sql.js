function bool(val) {
  if (val === undefined) return false;
  if (val === "") return false;
  if (val === null) return false;
  return true;
}

export function WHERE(compare, val) {
  if (!bool(compare)) return true;
  return compare === val;
}

export function NOT(compare, val) {
  if (!bool(compare)) return true;
  return compare !== val;
}

export function LIKE(compare, val, flags) {
  const reg = new RegExp(compare, flags);
  return reg.test(val);
}

export function IN(compare = [], val) {
  if (!compare || !compare.length) return true;
  return compare.some((el) => el === val);
}

export function BETWEEN(...args) {
  let min, max, val;
  if (args.length === 3) {
    min = args[0];
    max = args[1];
    val = args[2];
  }

  if (args.length === 2) {
    min = args[0][0];
    max = args[0][1];
    val = args[1];
  }

  if (!bool(min) && !bool(max)) return true;
  if (bool(min) && !bool(max)) return val >= min;
  if (!bool(min) && bool(max)) return val <= max;
  return min <= val && val <= max;
}
