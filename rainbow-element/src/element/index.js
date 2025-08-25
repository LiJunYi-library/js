export * from "./element.js";
import * as elements from "./element.js";

export function defineElements(props = {}) {
  for (const key in elements) {
    if (Object.prototype.hasOwnProperty.call(elements, key)) {
      const element = elements[key];
      const defineKey = key.replaceAll(/[A-Z]/g, (v) => "-" + v.toLowerCase()).slice(1);
      try {
        customElements.define(defineKey, element);
      } catch (error) {}
    }
  }

  if (props.render) rainbow.customRender = props.render;
  rainbow.toast = document.createElement("r-toast");
  rainbow.overlay = document.createElement("r-overlay");
  document.body.append(rainbow.overlay);
}
