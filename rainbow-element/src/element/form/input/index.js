import "./index.css";
import { RainbowElement } from "../../base/index.js";
import {
  findParentByLocalName,
  createCustomEvent,
  createElement,
  createSlot,
  resizeObserver,
  getBoundingClientRect,
  addEventListenerOnce,
} from "../../../utils/index.js";

function inheritAttrs(p = document.body, node = document.body, attrs) {
  console.log(p.getAttributeNames());
  p.getAttributeNames().forEach((name) => {
    const value = p.getAttribute(name);
    if (!(attrs instanceof Array)) return node.setAttribute(name, value);
    if (attrs.includes(name)) node.setAttribute(name, value);
  });
}

export class RInpput extends RainbowElement {
  $$ = {
    container: createElement("div", "r-input-container"),
    input: createElement("input", "r-input-inner"),
    oninput: (event) => {
      event.value = this.$$.input.value;
      this.$value = this.$$.input.value;
    },
  };

  constructor(...arg) {
    super(...arg);
    this.attachShadow({ mode: "open" });
    this.$$.container.append(this.$$.input);
    this.shadowRoot.append(this.$$.container);
  }

  connectedCallback(...arg) {
    super.connectedCallback(...arg);
    inheritAttrs(this, this.$$.input, ["type", "name"]);
    addEventListenerOnce(this.$$.input, "input", this.$$.oninput);
  }

  disconnectedCallback(...arg) {
    super.disconnectedCallback(...arg);
  }
}
