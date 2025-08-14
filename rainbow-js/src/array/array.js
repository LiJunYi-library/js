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
//循环,
export function arrayLoops(start, end, cb) {
  for (let index = start; index < end; index++) {
    if (cb(index) === false) return;
  }
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
    (value, item, index, list) => formatter(item, index, list) < value,
  );
}
//冒泡倒数查找最小
export function arrayBubbleLastMin(list = [], formatter) {
  return arrayBubble(
    list,
    formatter,
    (value, item, index, list) => formatter(item, index, list) <= value,
  );
}
//冒泡查找最大
export function arrayBubbleMax(list = [], formatter) {
  return arrayBubble(
    list,
    formatter,
    (value, item, index, list) => formatter(item, index, list) > value,
  );
}
//冒泡倒数查找最大
export function arrayBubbleLastMax(list = [], formatter) {
  return arrayBubble(
    list,
    formatter,
    (value, item, index, list) => formatter(item, index, list) >= value,
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
// 删除数组中的所有 相同的 item 不改变数组
export function arrayRemoves(list = [], item, ...args) {
  let fn;
  if (item instanceof Function) fn = item;
  else fn = (el) => ![item, ...args].includes(el);
  const sames = list.filter(fn);
  list.splice(0);
  list.push(...sames);
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
      !map.has(formatter(item, index).toString()) && map.set(formatter(item, index).toString()),
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

// 数组排序 根据属性正序
export function arraySort(list = [], formatter, formatter2) {
  let fmt = formatter2 || formatter;
  list.sort((a, b) => formatter(a) - fmt(b));
  return list;
}

export function arraySortMin(...arg) {
  return arraySort(...arg)[0];
}

export function arraySortMax(list = [], ...arg) {
  return arraySort(list, ...arg)[list.length - 1];
}

// 数组排序  根据属性倒序
export function arrayReverseSort(list = [], formatter, formatter2) {
  let fmt = formatter2 || formatter;
  list.sort((a, b) => fmt(b) - formatter(a));
  return list;
}

export function arrayReverseSortMin(...arg) {
  return arrayReverseSort(...arg)[list.length - 1];
}

export function arrayReverseSortMax(list = [], ...arg) {
  return arrayReverseSort(list, ...arg)[0];
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

/* 二分查找 */
export function arrayBinarySearch(
  setPointer = (args, index) => (args.right = index - 1),
  arr = [],
  formatter,
  compare,
) {
  const fg = {
    left: 0,
    right: arr.length - 1,
    result: -1,
  };
  while (fg.left <= fg.right) {
    const index = Math.floor((fg.left + fg.right) / 2);
    const item = arr[index];
    if (formatter(item)) {
      fg.result = index;
      setPointer(fg, index, item);
    } else if (compare(item)) {
      fg.left = index + 1;
    } else {
      fg.right = index - 1;
    }
  }
  return fg.result;
}
/* 二分查找到符合条件的第一个元素的下标 没有找到返回-1 compare<*/
export function arrayBinaryFindIndex(arr = [], formatter, compare) {
  return arrayBinarySearch(
    (args, index) => {
      args.right = index - 1;
    },
    arr,
    formatter,
    compare,
  );
}
/* 二分查找到符合条件的第一个元素 没有找到返回undefined compare<*/
export function arrayBinaryFind(arr = [], formatter, compare) {
  const index = arrayBinaryFindIndex(arr, formatter, compare);
  return index === -1 ? undefined : arr[index];
}
/* 二分查找到符合条件的最后一个元素的下标 没有找到返回-1 compare<*/
export function arrayBinaryFindLastIndex(arr = [], formatter, compare) {
  return arrayBinarySearch(
    (args, index) => {
      args.left = index + 1;
    },
    arr,
    formatter,
    compare,
  );
}
/* 二分查找到符合条件的最后一个元素 没有找到返回undefined compare<*/
export function arrayBinaryFindLast(arr = [], formatter, compare) {
  const index = arrayBinaryFindLastIndex(arr, formatter, compare);
  return index === -1 ? undefined : arr[index];
}

// 重新改变数组的方法 原来监听数组变化
export function arrayRewriteFunction(arr = [], props) {
  const funName = [
    "copyWithin",
    "fill",
    "push",
    "pop",
    "shift",
    "unshift",
    "splice",
    "sort",
    "reverse",
  ];
  const original = {};
  const defineProperties = {};

  funName.forEach((name) => {
    original[name] = arr[name];

    defineProperties[name] = {
      value: function (...args) {
        const res = original[name].call(arr, ...args);
        if (props instanceof Function) props?.("name", ...args);
        return res;
      },
      writable: true,
      enumerable: false,
      configurable: false,
    };
  });

  Object.defineProperties(arr, defineProperties);

  return arr;
}

//
export function arrayForEachFindIndex(arr = [], formatter) {
  let i = -1;
  arr.forEach((value, index, array) => {
    if (formatter?.(value, index, array)) {
      i = index;
    }
  });
  return i;
}
//
export function arrayForEachFind(arr = [], formatter) {
  let val = undefined;
  arr.forEach((value, index, array) => {
    if (formatter?.(value, index, array)) {
      val = value;
    }
  });
  return val;
}

export function arrayForcedTransform(v) {
  if (v instanceof Array) return v;
  return [];
}

export function arrayFindIndex(arr = [], item) {
  const i = arr.findIndex((val) => val === item);
  return i < 0 ? undefined : i;
}

export function arrayFindIndexs(arr = [], items = []) {
  return items.map((item) => arr.indexOf(item)).filter((i) => ~i);
}
