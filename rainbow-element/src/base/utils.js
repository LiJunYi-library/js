export function deleteKey(target, source, bool) {
  for (const key in target) {
    if (Object.prototype.hasOwnProperty.call(target, key)) {
      try {
        if (bool) source[key] = "";
        delete source[key];
      } catch (error) {}
    }
  }
}

export function assignStyle(style, newStyle) {
  for (const key in newStyle) {
    if (Object.prototype.hasOwnProperty.call(newStyle, key)) {
      style[key] = "";
      style[key] = newStyle[key];
    }
  }
}

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

// bubbles: true, cancelable: true,

export class RainbowEvent extends Event {
  constructor(type, eventInitDict, event) {
    super(type, eventInitDict);
    this.detail = event;
    if (event instanceof Array) {
      for (const key in event) {
        try {
          if (this[key] === undefined) this[key] = event[key];
        } catch (error) {
          console.warn(error);
        }
      }
    }
  }
}

export function createCustomEvent(name, event, eventInitDict = {}) {
  const newEvent = new CustomEvent(name, { bubbles: true, cancelable: true, ...eventInitDict });
  for (const key in event) {
    try {
      if (newEvent[key] === undefined) newEvent[key] = event[key];
    } catch (error) {
      console.warn(error);
    }
  }
  return newEvent;
}

export function renderChildren(props = {}) {
  const options = { parentNode: undefined, ...props };
  let cacheMap = new Map();
  let pointer = undefined;

  function renderList(source = [], p) {
    const config = {
      beforeEach: () => 0,
      keyExtractor: (item, index) => index,
      onCacheNode: () => 0,
      onCreateNode: () => 0,
      ...p,
    };
    const map = new Map();
    pointer = undefined;
    config.beforeEach({ cacheMap, pointer });
    source.forEach((item, index) => {
      const key = config.keyExtractor(item, index);
      let node;
      if (cacheMap.has(key)) {
        node = cacheMap.get(key);
        config.onCacheNode(node, item, index, key);
        if (pointer) {
          if (pointer.nextSibling === node) {
            //当前指针的下一个和要渲染的div相同 b不做处理
          } else {
            options.parentNode.insertBefore(node, pointer.nextSibling);
          }
        }
        pointer = node;
        cacheMap.delete(key);
      } else {
        node = config.onCreateNode(item, index, key);
        if (pointer) options.parentNode.insertBefore(node, undefined);
        else options.parentNode.insertBefore(node, pointer?.nextSibling);
        pointer = node;
      }

      map.set(key, node);
    });
    cacheMap.forEach((node) => node.remove());
    pointer = undefined;
    cacheMap = map;
  }

  return { renderList };
}
