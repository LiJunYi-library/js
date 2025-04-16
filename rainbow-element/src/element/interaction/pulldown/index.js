import "./index.css";
import { RainbowElement } from "../../base/index.js";
import {
  createElement,
  createSlot,
  addEventListenerOnce,
  createElementCB,
  createCustomEvent,
} from "../../../utils/index.js";

export class RPulldown extends RainbowElement {
  static observedAttributes = this.$registerProps({
    "r-placement": String, // "left" | "right" | "top" | "bottom"
  });

  $$ = {
    labelSlot: createSlot("slot", "", "label"),
    iconSlot: createSlot("slot", "", "icon"),
    defaultIcon: createElementCB("i", (el) => {
      el.className = "r-pulldown-default-icon iconfont";
      el.innerHTML = "&#xe887;";
      el.setAttribute("slot", "icon");
    }),
    dialog: createElement("r-dialog", "r-pulldown-dialog"),
    dialogClass: undefined,
    onBeforeOpen: (event) => {
      this.dispatchEvent(createCustomEvent("beforeOpen", event));
    },
    onOpen: (event) => {
      this.$$.dialog.$$.closePrveDialog();
      this.cssList.toggle(this.value, "r-pulldown-show", "r-pulldown-hide");
      this.dispatchEvent(createCustomEvent("open", event));
    },
    onOpened: (event) => {
      this.dispatchEvent(createCustomEvent("opened", event));
    },
    onBeforeClose: (event) => {
      this.dispatchEvent(createCustomEvent("beforeClose", event));
    },
    onClose: (event) => {
      this.cssList.toggle(this.value, "r-pulldown-show", "r-pulldown-hide");
      this.dispatchEvent(createCustomEvent("close", event));
    },
    onClosed: (event) => {
      this.dispatchEvent(createCustomEvent("closed", event));
    },
    onClick: (event) => {
      event.stopPropagation();
      this.$layout();
      this.$updateValue(!this.$$.dialog.value);
    },
    onDialogInput: (event) => {
      this.dispatchEvent(createCustomEvent("input", event));
    },
    layout: {
      left: (offset) => {
        this.$$.dialog.style.setProperty("--r-blank-right", `${innerWidth - offset.left}px`);
      },
      right: (offset) => {
        this.$$.dialog.style.setProperty("--r-blank-left", `${offset.right}px`);
      },
      top: (offset) => {
        this.$$.dialog.style.setProperty("--r-blank-bottom", `${innerHeight - offset.top}px`);
      },
      bottom: (offset) => {
        this.$$.dialog.style.setProperty("--r-blank-top", `${offset.bottom}px`);
      },
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

  set dialogClass(v) {
    this.$$.dialogClass = v;
    this.$$.dialog.className = ["r-pulldown-dialog", v].flat(Infinity).join(" ");
  }

  get dialogClass() {
    return this.$$.dialogClass;
  }

  constructor(...arg) {
    super(...arg);
    this.attachShadow({ mode: "open" });
    this.shadowRoot.appendChild(this.$$.labelSlot);
    this.shadowRoot.appendChild(this.$$.iconSlot);
    addEventListenerOnce(this, "click", this.$$.onClick);
    addEventListenerOnce(this.$$.dialog, "input", this.$$.onDialogInput);
    addEventListenerOnce(this.$$.dialog, "beforeOpen", this.$$.onBeforeOpen);
    addEventListenerOnce(this.$$.dialog, "open", this.$$.onOpen);
    addEventListenerOnce(this.$$.dialog, "opened", this.$$.onOpened);
    addEventListenerOnce(this.$$.dialog, "beforeClose", this.$$.onBeforeClose);
    addEventListenerOnce(this.$$.dialog, "close", this.$$.onClose);
    addEventListenerOnce(this.$$.dialog, "closed", this.$$.onClosed);
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

  $onResizeObserver(...arg) {
    super.$onResizeObserver(...arg);
    this.$layout();
  }

  $onStyleChang(...arg) {
    super.$onStyleChang(...arg);
    this.$layout();
  }

  $render() {
    this.cssList.toggle(this.value, "r-pulldown-show", "r-pulldown-hide");
    const children = Array.from(this.children).filter((el) => el.getAttribute("slot") === null);
    this.$$.dialog.append(...children);
  }

  $layout() {
    const offset = this.getBoundingClientRect();
    const { rPlacement } = this.$.DATA;
    const placement = rPlacement.split("|").map((v) => v.trim());
    placement.forEach((key) => this.$$.layout?.[key]?.(offset));
  }
}
