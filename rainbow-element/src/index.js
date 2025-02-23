import "./index.css";
import "./iconfont/iconfont.css";
export * from "./global.js";
export * from "./base/index.js";
export * from "./element.js";
import * as elements from "./element.js";

export function defineElements() {
  for (const key in elements) {
    if (Object.prototype.hasOwnProperty.call(elements, key)) {
      const element = elements[key];
      const defineKey = key.replaceAll(/[A-Z]/g, (v) => "-" + v.toLowerCase()).slice(1);
      customElements.define(defineKey, element);
    }
  }
}


defineElements();
