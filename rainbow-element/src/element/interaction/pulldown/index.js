import "./index.css";
import { RainbowElement } from "../../base/index.js";
import {
  createElement,
  createSlot,
  getBoundingClientRect,
  addEventListenerOnce,
  createElementCB,
  createCustomEvent,
} from "../../../utils/index.js";

export class RPulldown extends RainbowElement {
  $$ = {
    labelSlot: createSlot("slot", "", "label"),
    iconSlot: createSlot("slot", "", "icon"),
    defaultIcon: createElementCB("i", (el) => {
      el.className = "r-pulldown-default-icon iconfont";
      el.innerHTML = "&#xe887;";
      el.setAttribute("slot", "icon");
    }),
    dialog: createElement("r-dialog", "r-pulldown-dialog"),
    onOpen: (event) => {
      this.cssList.toggle(this.value, "r-pulldown-show", "r-pulldown-hide");
      this.dispatchEvent(createCustomEvent("open", event));
    },
    onClose: (event) => {
      this.cssList.toggle(this.value, "r-pulldown-show", "r-pulldown-hide");
      this.dispatchEvent(createCustomEvent("close", event));
    },
    onClick: (event) => {
      event.stopPropagation();
      const offset = this.getBoundingClientRect();
      this.$$.dialog.style.setProperty("--r-blank-top", `${offset.bottom}px`);
      this.$updateValue(!this.$$.dialog.value);
    },
    onDialogInput: (event) => {
      this.dispatchEvent(createCustomEvent("input", event));
    },
  };

  $updateValue = (val) => {
    this.$$.dialog.value = val;
    this.dispatchEvent(createCustomEvent("input", { value: val }));
  };

  set value(v) {
    this.$$.dialog.value = v;
  }

  get value() {
    return this.$$.dialog.value;
  }

  constructor(...arg) {
    super(...arg);
    this.attachShadow({ mode: "open" });
    this.shadowRoot.appendChild(this.$$.labelSlot);
    this.shadowRoot.appendChild(this.$$.iconSlot);
    addEventListenerOnce(this, "click", this.$$.onClick);
    addEventListenerOnce(this.$$.dialog, "input", this.$$.onDialogInput);
    addEventListenerOnce(this.$$.dialog, "open", this.$$.onOpen);
    addEventListenerOnce(this.$$.dialog, "close", this.$$.onClose);
  }

  connectedCallback(...arg) {
    super.connectedCallback(...arg);
    this.appendChild(this.$$.defaultIcon);
    document.body.append(this.$$.dialog);
    this.$render();
  }

  disconnectedCallback(...arg) {
    super.disconnectedCallback(...arg);
    document.body.removeChild(this.$$.dialog);
  }

  $render() {
    this.cssList.toggle(this.value, "r-pulldown-show", "r-pulldown-hide");
    const children = Array.from(this.children).filter((el) => el.getAttribute("slot") === null);
    this.$$.dialog.append(...children);
  }
}
