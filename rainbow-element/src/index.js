import "./iconfont/iconfont.css";
export * from "./base/index.js";
import * as elements from "./element.js";

for (const key in elements) {
  if (Object.prototype.hasOwnProperty.call(elements, key)) {
    const element = elements[key];
    console.log(key);
  }
}
