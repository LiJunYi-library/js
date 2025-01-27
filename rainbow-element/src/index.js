import "./iconfont/iconfont.css";
export * from "./base/index.js";
import * as elements from "./element.js";

for (const key in elements) {
  if (Object.prototype.hasOwnProperty.call(elements, key)) {
    const element = elements[key];
    const defineKey = key.replaceAll(/[A-Z]/g, (v) => ("-" + v.toLowerCase()) ).slice(1);
    // console.log(key);
    // console.log(defineKey);
    customElements.define(defineKey, element);
  }
}
