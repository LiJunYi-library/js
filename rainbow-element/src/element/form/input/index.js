import "./index.scss";
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

function inheritAttrs(p = document.body, node = document.body, attrs, ignore) {
  p.getAttributeNames().forEach((name) => {
    const value = p.getAttribute(name);
    if (!(attrs instanceof Array)) return node.setAttribute(name, value);
    if (ignore) {
      if (!attrs.includes(name)) node.setAttribute(name, value);
      return;
    }
    if (attrs.includes(name)) node.setAttribute(name, value);
  });
}

function stringGetLength(str) {
  if (typeof str === "string") return str.length;
  return 0;
}

export class RInput extends RainbowElement {
  static observedAttributes = this.$registerProps({
    label: String,
    type: String,
    maxlength: String,
  });
  $$ = {
    floating: createElement("div", "r-input-floating"),
    label: createElement("div", "r-input-label"),
    space: createElement("div", "r-input-space"),
    clear: createElement("div", "r-input-clear"),
    password: createElement("div", "r-input-password"),
    limit: createElement("div", "r-input-limit"),
    container: createElement("div", "r-input-container"),
    input: createElement("input", "r-input-inner"),
    secret: false,
    oninput: (event) => {
      event.value = this.$$.input.value;
      this.$value = this.$$.input.value;
      this.$layout();
    },
    onclear: (event) => {
      event.value = undefined;
      this.$$.input.value = undefined;
      this.$updateValue(undefined);
      this.dispatchEvent(createCustomEvent("clear", { event }));
      this.$layout();
    },
    onfocus: (event) => {
      this.cssList.toggle(true, "r-input-focus", "r-input-blur");
    },
    onblur: (event) => {
      this.cssList.toggle(false, "r-input-focus", "r-input-blur");
    },
    onclick: (event) => {
      this.$$.input.focus();
    },
    onpasswordClick: (event) => {
      this.$$.secret = !this.$$.secret;
      this.$$.setTypePassword();
    },
    setTypePassword: () => {
      const { type } = this.$.ATTRS;
      if (type !== "password") return;
      this.cssList.toggle(Boolean(this.$$.secret), "r-input-secret", "r-input-no-secret");
      this.$$.input.setAttribute("type", this.$$.secret ? "password" : "text");
    },
  };

  constructor(...arg) {
    super(...arg);
    this.attachShadow({ mode: "open" });
    this.$$.floating.append(this.$$.label);
    this.$$.floating.append(this.$$.space);
    this.$$.floating.append(this.$$.clear);
    this.$$.floating.append(this.$$.password);
    this.$$.floating.append(this.$$.limit);
    this.$$.container.append(this.$$.input);
    this.shadowRoot.append(this.$$.floating);
    this.shadowRoot.append(this.$$.container);
    addEventListenerOnce(this.$$.input, "input", this.$$.oninput);
    addEventListenerOnce(this.$$.input, "focus", this.$$.onfocus);
    addEventListenerOnce(this.$$.input, "blur", this.$$.onblur);
    addEventListenerOnce(this.$$.clear, "click", this.$$.onclear);
    addEventListenerOnce(this.$$.password, "click", this.$$.onpasswordClick);
    addEventListenerOnce(this, "click", this.$$.onclick);
  }

  connectedCallback(...arg) {
    super.connectedCallback(...arg);
    this.$$.secret = this.$.ATTRS.type === "password";
    this.$$.setTypePassword();
    this.$layout();
    this.$render();
  }

  $onAttributeChanged(...arg) {
    super.$onAttributeChanged(...arg);
    this.$render();
  }

  $onValueChange(val) {
    this.$$.input.value = val;
    this.$layout();
  }

  disconnectedCallback(...arg) {
    super.disconnectedCallback(...arg);
  }

  $layout() {
    const { maxlength } = this.$.ATTRS;
    this.cssList.toggle(Boolean(this.value), "r-input-have-value", "r-input-no-value");
    this.$$.limit.innerText = `${stringGetLength(this.value)}/${maxlength}`;
  }

  $render() {
    const { label, maxlength, type } = this.$.ATTRS;
    inheritAttrs(this, this.$$.input, ["class", "css-name"], true);
    this.$$.setTypePassword();
    this.$$.label.innerText = label;
    this.$$.limit.innerText = `${stringGetLength(this.value)}/${maxlength}`;
  }
}
