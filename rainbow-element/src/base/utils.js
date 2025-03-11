import { numFixed, requestAnimationFramePromise } from "@rainbow_ljy/rainbow-js";

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
  let recycle = [];

  function renderList(source = [], p) {
    const config = {
      beforeEach: () => 0,
      keyExtractor: (item, index) => index,
      onCacheNode: () => 0,
      onCreateNode: () => 0,
      onDeleteNode: () => 0,
      onRemoveNode: () => 0,
      onBeforeInsertNode: () => 0,
      onInsertBeforeNode: () => 0,
      ...p,
    };
    const map = new Map();
    pointer = undefined;
    config.beforeEach({ cacheMap, pointer });
    source.forEach((item, index) => {
      const key = config.keyExtractor(item, index);
      let node;
      config.onBeforeInsertNode(item, index, key);
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
        config.onDeleteNode(node, item, index, key);
      } else {
        node = config.onCreateNode(item, index, key);
        if (!pointer) options.parentNode.insertBefore(node, options.parentNode?.firstChild);
        else options.parentNode.insertBefore(node, pointer?.nextSibling);
        pointer = node;
      }
      config.onInsertBeforeNode(node, item, index, key);
      map.set(key, node);
    });
    cacheMap.forEach((node, key) => {
      node.remove();
      config.onRemoveNode(node, key);
    });
    pointer = undefined;
    cacheMap = map;
  }

  return { renderList };
}

export function createElement(name = "div", className = "") {
  const ele = document.createElement(name);
  ele.setAttribute("part", className);
  ele.className = className;
  return ele;
}

export function createSlot(name = "slot", className = "", slotName = className) {
  const ele = createElement(name, className);
  ele.setAttribute("name", slotName);
  return ele;
}

export function wipePX(str = "") {
  if (typeof str === "number") return str;
  if (/px/.test(str)) str = str.replace(/px/g, "");
  if (/\d+/.test(str)) return Number(str);
  return str;
}

export function toggleClass(node, bool, addClass = "", removeClass = "") {
  if (bool) {
    if (addClass) node.classList.add(addClass);
    if (removeClass) node.classList.remove(removeClass);
  } else {
    if (removeClass) node.classList.add(removeClass);
    if (addClass) node.classList.remove(addClass);
  }
}

export function isNum(d) {
  return typeof d === "number";
}

export function transition(props = {}) {
  const config = {
    node: createElement(),
    eventNode: createElement(),
    dispatchNode: createElement(),
    formatterVisible: (node) => node.value,
    name: "",
    ...props,
  };

  const args = {
    value: undefined,
    animateSymbol: 1,
    finishSymbol: 1,
    onTransitionend: () => {
      args.finishSymbol = args.animateSymbol;
      config.node.classList.remove(`${config.name}-enter-active`);
      config.node.classList.remove(`${config.name}-leave-active`);
      config.node.classList.remove(`${config.name}-enter-to`);
      config.node.classList.remove(`${config.name}-leave-to`);
      if (config.formatterVisible(config.node)) {
        config.node.classList.remove(`${config.hideClassName}`);
        config.dispatchNode.dispatchEvent(createCustomEvent("afterEnter"));
      } else {
        config.node.classList.add(`${config.hideClassName}`);
        config.dispatchNode.dispatchEvent(createCustomEvent("afterLeave"));
      }
    },
    async show() {
      if (args.value === true) return;
      args.value = true;
      config.node.classList.remove(`${config.hideClassName}`);
      config.node.classList.remove(`${config.name}-leave-from`);
      config.node.classList.remove(`${config.name}-leave-active`);
      config.node.classList.remove(`${config.name}-leave-to`);
      config.node.classList.add(`${config.name}-enter-from`);
      config.dispatchNode.dispatchEvent(createCustomEvent("beforeEnter"));
      if (args.animateSymbol === args.finishSymbol) {
        args.animateSymbol = Symbol();
        await requestAnimationFramePromise();
      }
      config.node.classList.remove(`${config.name}-enter-from`);
      config.node.classList.add(`${config.name}-enter-active`);
      config.node.classList.add(`${config.name}-enter-to`);
      config.dispatchNode.dispatchEvent(createCustomEvent("enter"));
      config.eventNode.removeEventListener("transitionend", this.onTransitionend);
      config.eventNode.addEventListener("transitionend", this.onTransitionend);
    },

    async hide() {
      if (args.value === false) return;
      args.value = false;
      config.node.classList.remove(`${config.name}-enter-from`);
      config.node.classList.remove(`${config.name}-enter-active`);
      config.node.classList.remove(`${config.name}-enter-to`);
      config.node.classList.add(`${config.name}-leave-from`);
      config.dispatchNode.dispatchEvent(createCustomEvent("beforeLeave"));
      if (args.animateSymbol === args.finishSymbol) {
        args.animateSymbol = Symbol();
        await requestAnimationFramePromise();
      }
      config.node.classList.remove(`${config.name}-leave-from`);
      config.node.classList.add(`${config.name}-leave-active`);
      config.node.classList.add(`${config.name}-leave-to`);
      config.dispatchNode.dispatchEvent(createCustomEvent("leave"));
      config.eventNode.removeEventListener("transitionend", this.onTransitionend);
      config.eventNode.addEventListener("transitionend", this.onTransitionend);
    },
  };

  return args;
}

export function resizeObserver(callBack) {
  let obs = {
    disconnect: () => undefined,
    observe: () => undefined,
    unobserve: () => undefined,
  };

  try {
    obs = new ResizeObserver(async (...arg) => {
      await callBack(...arg);
    });
  } catch (error) {}

  return obs;
}

export function getBoundingClientRect(node) {
  if (!node)
    return {
      bottom: undefined,
      height: undefined,
      left: undefined,
      right: undefined,
      top: undefined,
      width: undefined,
      x: undefined,
      y: undefined,
    };
  const offset = node.getBoundingClientRect();
  return {
    bottom: numFixed(offset.bottom),
    height: numFixed(offset.height),
    left: numFixed(offset.left),
    right: numFixed(offset.right),
    top: numFixed(offset.top),
    width: numFixed(offset.width),
    x: numFixed(offset.x),
    y: numFixed(offset.y),
  };
}


export function createDialog(params) {
  const dialog = document.createElement("r-dialog");
  document.body.appendChild(dialog);

  function fun(node) {
    rainbow.customRender(node, dialog);
    dialog.value = true;
  }

  fun.ele = dialog;

  fun.close = () => {
    dialog.value = false;
  };

  return fun;
}

window.rainbow.createDialog=createDialog
