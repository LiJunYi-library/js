import { numFixed, promiseRequestAnimationFrame } from "@rainbow_ljy/rainbow-js";

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

export function createElement(name = "div", className = "", part = className) {
  const ele = document.createElement(name);
  if (part) ele.setAttribute("part", part);
  ele.className = className;
  ele.cssName = className;
  return ele;
}

export function createElementCB(name = "div", cb) {
  const ele = document.createElement(name);
  if (cb) cb(ele);
  return ele;
}

export function createSlotElement(name = "div", slot = "", className = "") {
  const ele = document.createElement(name);
  ele.setAttribute("slot", slot);
  ele.className = className;
  return ele;
}

export function createSlot(name = "slot", className = "", slotName = className) {
  const ele = createElement(name, className);
  if (slotName) ele.setAttribute("name", slotName);
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

export function transition(props = {}) {
  const config = {
    node: undefined,
    eventNode: undefined,
    dispatchNode: undefined,
    formatterVisible: (node) => node.value,
    name: "",
    hideName: "",
    property: "cssList",
    ...props,
  };

  const args = {
    value: undefined,
    animateSymbol: 1,
    finishSymbol: 1,
    onTransitionend: () => {
      args.finishSymbol = args.animateSymbol;
      config.node[config.property].remove(`${config.name}-enter-active`);
      config.node[config.property].remove(`${config.name}-leave-active`);
      config.node[config.property].remove(`${config.name}-enter-to`);
      config.node[config.property].remove(`${config.name}-leave-to`);
      if (config.formatterVisible(config.node)) {
        config.node[config.property].remove(`${config.hideName}`);
        config.dispatchNode.dispatchEvent(createCustomEvent("afterEnter"));
      } else {
        config.node[config.property].add(`${config.hideName}`);
        config.dispatchNode.dispatchEvent(createCustomEvent("afterLeave"));
      }
    },
    async show() {
      if (args.value === true) return;
      args.value = true;
      config.node[config.property].remove(`${config.hideName}`);
      config.node[config.property].remove(`${config.name}-leave-from`);
      config.node[config.property].remove(`${config.name}-leave-active`);
      config.node[config.property].remove(`${config.name}-leave-to`);
      config.node[config.property].add(`${config.name}-enter-from`);
      config.dispatchNode.dispatchEvent(createCustomEvent("beforeEnter"));
      if (args.animateSymbol === args.finishSymbol) {
        args.animateSymbol = Symbol();
        await promiseRequestAnimationFrame();
      }
      config.node[config.property].remove(`${config.name}-enter-from`);
      config.node[config.property].add(`${config.name}-enter-active`);
      config.node[config.property].add(`${config.name}-enter-to`);
      config.dispatchNode.dispatchEvent(createCustomEvent("enter"));
      (() => {
        if (hasTransitionDuration(config.eventNode)) {
          config.eventNode.removeEventListener("transitionend", this.onTransitionend);
          config.eventNode.addEventListener("transitionend", this.onTransitionend);
          return;
        }
        if (hasAnimationDuration(config.eventNode)) {
          config.eventNode.removeEventListener("animationend", this.onTransitionend);
          config.eventNode.addEventListener("animationend", this.onTransitionend);
          return;
        }
        this.onTransitionend();
      })();
    },

    async hide() {
      if (args.value === false) return;
      args.value = false;
      config.node[config.property].remove(`${config.name}-enter-from`);
      config.node[config.property].remove(`${config.name}-enter-active`);
      config.node[config.property].remove(`${config.name}-enter-to`);
      if (hasAnimationDuration(config.eventNode)) {
        config.eventNode.style.animationPlayState = "paused";
      }
      config.node[config.property].add(`${config.name}-leave-from`);
      config.dispatchNode.dispatchEvent(createCustomEvent("beforeLeave"));
      if (args.animateSymbol === args.finishSymbol) {
        args.animateSymbol = Symbol();
        await promiseRequestAnimationFrame();
      }
      config.node[config.property].remove(`${config.name}-leave-from`);
      config.node[config.property].add(`${config.name}-leave-active`);
      config.node[config.property].add(`${config.name}-leave-to`);
      config.dispatchNode.dispatchEvent(createCustomEvent("leave"));
      (() => {
        if (hasTransitionDuration(config.eventNode)) {
          config.eventNode.removeEventListener("transitionend", this.onTransitionend);
          config.eventNode.addEventListener("transitionend", this.onTransitionend);
          return;
        }
        if (hasAnimationDuration(config.eventNode)) {
          config.eventNode.removeEventListener("animationend", this.onTransitionend);
          config.eventNode.addEventListener("animationend", this.onTransitionend);
          return;
        }
        this.onTransitionend();
      })();
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

export function findParentByLocalName(name, node) {
  if (!node) return;
  const parent = node.parentNode;
  if (!parent) return;
  if (name instanceof Array && name.includes(parent.localName)) return parent;
  if (parent.localName === name) return parent;
  return findParentByLocalName(name, parent);
}

export function getOffsetTop(node, p, num = 0) {
  if (!node) return num;
  if (node === p) return num;
  let top = num + node?.offsetTop ?? 0;
  return getOffsetTop(node.offsetParent, p, top);
}

export function findFixedParent(node) {
  if (node === document.body) return document.body;
  if (!node) return document.body;
  const parent = node.parentNode;
  if (!parent) return document.body;
  const style = window.getComputedStyle(parent);
  const property = ["transform", "perspective", "filter", "backdrop-filter"];
  const unNone = property.some((str) => style.getPropertyValue(str).trim() !== "none");
  if (unNone) return parent;
  return findFixedParent(parent);
}

export function findPositionParent(node) {
  if (node.offsetParent) return node.offsetParent;
  return findFixedParent(node);
}

export function getComputedStyleProperty(node, property) {
  const style = window.getComputedStyle(node);
  return style.getPropertyValue(property).trim();
}

export function hasTransitionDuration(node) {
  let duration = getComputedStyleProperty(node, "transition-duration");
  if (duration === "0s") return false;
  if (duration === "0") return false;
  return true;
}

export function hasAnimationDuration(node) {
  let duration = getComputedStyleProperty(node, "animation-duration");
  if (duration === "0s") return false;
  if (duration === "0") return false;
  return true;
}

export function addEventListenerOnce(node, type, ls, config) {
  if (!node) return;
  node.removeEventListener(type, ls, config);
  node.addEventListener(type, ls, config);
}

export function removeEventListener(node, type, ls, config) {
  if (!node) return;
  node.removeEventListener(type, ls, config);
}

export function functionInvokeKey(o = {}, key) {
  const f = () => 0;
  return o[key] || o["default"] || f;
}

export function getChildren(node, localName) {
  let cs = Array.from(node.children);
  if (!localName) return cs;
  return cs.filter((c) => c.localName === localName);
}

//TODO
export function scrollIntoView(pView, view, top = 0, left = 0) {
  const config = {
    behavior: "instant",
    top,
    left,
  };
  if (typeof top === "object") Object.assign(config, top);
  const t = getOffsetTop(view, pView) + config.top;
  if (pView.scrollTop <= t) return;
  config.top = t;
  pView.scrollTo(config);
  return config;
}

export function emptyChildren(node) {
  for (let i = 0; i < node.children.length; i++) {
    const child = node.children[i];
    node.removeChild(child);
  }
}

export function copyChildren(node = document.createElement("div")) {
  let list = [];
  for (let i = 0; i < node.children.length; i++) {
    const child = node.children[i];
    const cloneChild = child.cloneNode(true);
    list.push(cloneChild);
  }
  return list;
}
