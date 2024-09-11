const testArr = [
  // { num: 33, tt: "奇" },
  // { num: 44, tt: "偶" },
  // { num: 11, tt: "奇***" },
  // { num: 99, tt: "奇***" },
  // { num: 22, tt: "偶" },
  // { num: 77, tt: "奇" },
  // { num: 88, tt: "偶" },
  // { num: 99, tt: "奇----" },
  // { num: 55, tt: "奇" },
  // { num: 11, tt: "奇----" },
  // { num: 66, tt: "偶" },

  { num: 11, tt: "奇" },
  { num: 22, tt: "偶" },
  { num: 33, tt: "奇***" },
  { num: 44, tt: "偶***" },
  { num: 55, tt: "奇" },
  { num: 66, tt: "偶" },
  { num: 77, tt: "奇" },
  { num: 88, tt: "偶----" },
  { num: 99, tt: "奇" },
];

export * from "./sql";

if (!Array.prototype.at) {
  Array.prototype.at = function (...arg) {
    return arrayAt(this, ...arg);
  };
}

export function arrayAt(list, index) {
  let nth = index < 0 ? list.length + index : index;
  return list[nth];
}

//循环
export function arrayLoop(num, cb) {
  for (let index = 0; index < num; index++) {
    if (cb(index) === false) return;
  }
}
//循环创建
export function arrayLoopMap(num, cb) {
  const arr = [];
  for (let index = 0; index < num; index++) {
    arr.push(cb(index));
  }
  return arr;
}
//冒泡查找
export function arrayBubble(list = [], formatter, verdict) {
  let value = null;
  let index;
  let item;
  list.forEach((ele, nth) => {
    if (value === null) {
      item = ele;
      index = nth;
      value = formatter(ele, nth, list);
      return;
    }

    if (verdict(value, ele, nth, list)) {
      item = ele;
      index = nth;
      value = formatter(ele, nth, list);
    }
  });
  return item;
}
//冒泡查找最小
export function arrayBubbleMin(list = [], formatter) {
  return arrayBubble(
    list,
    formatter,
    (value, item, index, list) => formatter(item, index, list) < value
  );
}
//冒泡倒数查找最小
export function arrayBubbleLastMin(list = [], formatter) {
  return arrayBubble(
    list,
    formatter,
    (value, item, index, list) => formatter(item, index, list) <= value
  );
}
//冒泡查找最大
export function arrayBubbleMax(list = [], formatter) {
  return arrayBubble(
    list,
    formatter,
    (value, item, index, list) => formatter(item, index, list) > value
  );
}
//冒泡倒数查找最大
export function arrayBubbleLastMax(list = [], formatter) {
  return arrayBubble(
    list,
    formatter,
    (value, item, index, list) => formatter(item, index, list) >= value
  );
}
// 删除数组中的第n个 改变数组
export function arrayRemoveIndex(list = [], num) {
  list.splice(num, 1);
  return list;
}
// 删除数组中第一个找到的item 不改变数组
export function arrayRemove(list = [], item) {
  const index = list.findIndex((el) => el === item);
  if (~index) list.splice(index, 1);
  return list;
}
// 删除数组中最后一个找到的item  不改变数组
export function arrayRemoveLast(list = [], item) {
  const index = list.findLastIndex((el) => el === item);
  if (~index) list.splice(index, 1);
  return list;
}
// 删除数组中的所有 相同的 item 改变数组
export function arrayRemoves(list = [], item) {
  const sames = list.filter((el) => el === item);
  sames.forEach((el) => {
    arrayRemove(list, el);
  });
  return list;
}
// 切割数组的index
export function arraySplitIndex(list = [], num) {
  const arr = [];
  for (let index = 0; index < list.length; index += num) {
    const ar = [];
    const max = index + num > list.length ? list.length : index + num;
    for (let j = index; j < max; j++) {
      ar.push(j);
    }
    arr.push(ar);
  }
  return arr;
}
// 切割数组
export function arraySplit(list = [], num) {
  const arr = [];
  for (let index = 0; index < list.length; index += num) {
    const max = index + num > list.length ? list.length : index + num;
    const ar = list.slice(index, max);
    arr.push(ar);
  }
  return arr;
}
// 数组 根据某个属性 去重
export function arrayWipeRepetition(list = [], formatter) {
  if (!formatter) return [...new Set(list)];
  const map = new Map();
  return list.filter(
    (item, index) =>
      !map.has(formatter(item, index).toString()) &&
      map.set(formatter(item, index).toString())
  );
}
// 数组 根据某个属性 去重 从后面
export function arrayWipeRepetitionLast(list = [], formatter) {
  if (!formatter) return [...new Set(list)];
  const map = {};
  list.forEach((item, index) => (map[formatter(item, index)] = item));
  const arr = [];
  for (const key in map) {
    if (Object.hasOwnProperty.call(map, key)) {
      const element = map[key];
      arr.push(element);
    }
  }
  return arr;
}
// 数组提取相同
export function arrayExtractSame(list = [], formatter) {
  const map = {};
  list.forEach((item) => {
    if (!map[formatter(item)]) map[formatter(item)] = [];
    map[formatter(item)].push(item);
  });
  const arr = [];
  for (const key in map) {
    if (Object.hasOwnProperty.call(map, key)) {
      const element = map[key];
      if (element.length > 1) arr.push(element);
    }
  }
  return arr.flat();
}
/**
 * 数组排序 根据另一个数组的属性
 * @param {*} list
 * @param {*} arr
 * @param {*} formatter
 * @returns
 */
export function arraySortByList(list, arr, formatter) {
  list.forEach((item) => {
    const sortIndex = arr.findIndex((ele) => formatter(item, ele));
    item.sortIndex = sortIndex === -1 ? list.length : sortIndex;
  });
  list.sort(function (a, b) {
    return a.sortIndex - b.sortIndex;
  });
  return list;
}
// 数组打乱
export function arrayRandom(list) {
  const length = list.length;
  for (let nth = 0; nth < length; nth++) {
    const index = Math.floor(Math.random() * (list.length - 1));
    list.push(list[index]);
    list.splice(index, 1);
  }
  return list;
}
// 触发数组方法
export function arrayInvokeFuns(...args) {
  const [list, formatter, ...arg] = args;
  let funArgs = [formatter, ...arg];
  let fmt = (item) => item;
  if (formatter instanceof Function) {
    fmt = formatter;
    funArgs = [...arg];
  }
  list.forEach((item) => {
    const fun = fmt(item);
    fun(...funArgs);
  });
}
/* 事件派发 */
export function arrayEvents() {
  const events = [];

  function push(eventCB) {
    events.push(eventCB);
  }

  function remove(eventCB) {
    arrayRemove(events, eventCB);
  }

  function invoke(...args) {
    arrayInvokeFuns(events, ...args);
  }

  function invokes(fun) {
    events.forEach(fun);
  }

  return { events, push, remove, invoke, invokes };
}

export function arrayBinaryFind(list, value) {
  let start = 0;
  let end = list.length - 1;

  while (start <= end) {
    let index = Math.floor((start + end) / 2);
    if (list[index] === value) {
      return index;
    } else if (list[index] < value) {
      start = index + 1;
    } else {
      end = index - 1;
    }
  }

  return -1;
}

