import { arrayRemove } from "./";

export class ListArray extends Array {
  constructor(...args) {
    super(...args);

    Object.defineProperty(this, "events", {
      value: {},
      writable: true,
      enumerable: false,
      configurable: false,
    });
  }

  addEventListener(type, listener) {
    if (!this.events[type]) this.events[type] = [];
    this.events[type].push(listener);
  }

  removeEventListener(type, listener) {
    if (!this.events[type]) this.events[type] = [];
    arrayRemove(this.events[type], listener);
  }

  onChange(name, ...args) {
    if (this.events.change instanceof Array) {
      this.events.change.forEach((funs) => funs(name, ...args));
    }

    if (this.events[name] instanceof Array) {
      this.events[name].forEach((funs) => funs(...args));
    }
  }

  copyWithin(...args) {
    let res = super.copyWithin(...args);
    this?.onChange?.("copyWithin", ...args);
    return res;
  }

  fill(...args) {
    let res = super.fill(...args);
    this?.onChange?.("fill", ...args);
    return res;
  }

  pop(...args) {
    let res = super.pop(...args);
    this?.onChange?.("pop", ...args);
    return res;
  }

  push(...args) {
    let res = super.push(...args);
    this?.onChange?.("push", ...args);
    return res;
  }

  shift(...args) {
    let res = super.shift(...args);
    this?.onChange?.("shift", ...args);
    return res;
  }

  unshift(...args) {
    let res = super.unshift(...args);
    this?.onChange?.("unshift", ...args);
    return res;
  }

  splice(...args) {
    let res = super.splice(...args);
    this?.onChange?.("splice", ...args);
    return res;
  }

  sort(...args) {
    let res = super.sort(...args);
    this?.onChange?.("sort", ...args);
    return res;
  }

  reverse(...args) {
    let res = super.reverse(...args);
    this?.onChange?.("reverse", ...args);
    return res;
  }
}
