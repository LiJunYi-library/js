import { RainbowElement } from "../base/index.js";
import { addEventListenerOnce, createSlot, createSlotElement } from "../../utils/index.js";

export class RAsyncClick extends RainbowElement {
  $$ = {
    prveSlot: createSlot("slot", "r-async-prve-slot", "prve"),
    nextSlot: createSlot("slot", "r-async-next-slot", "next"),
    prveEl: createSlotElement("div", "prve", "r-prve"),
    nextEl: createSlotElement("div", "next", "r-next"),
    defaultSlot: createSlot("slot", "r-async-default-slot", ""),
    loading: false,
    onclick_: async () => undefined,
    onClick: async (...args) => {
      if (!this.$$.onclick_) return;
      if (this.disabled === true) return;
      if (this.$$.loading === true) return;
      this.$$.loading = true;
      this.cssList.add("loading");
      const res = this.$$.onclick_(...args);
      if (res instanceof Promise) {
        res.finally(this.$$.close);
        return;
      }
      this.$$.close();
    },
    close: () => {
      this.$$.loading = false;
      this.cssList.remove("loading");
      this.$$.onfinally();
    },
    onfinally: () => 0,
  };

  set onclick(v) {
    this.$$.onclick_ = v;
  }

  get onclick() {
    return this.$$.onclick_;
  }

  constructor(...arg) {
    super(...arg);
    this.attachShadow({ mode: "open" });
    this.shadowRoot.appendChild(this.$$.prveSlot);
    this.shadowRoot.appendChild(this.$$.defaultSlot);
    this.shadowRoot.appendChild(this.$$.nextSlot);
  }

  connectedCallback(...arg) {
    super.connectedCallback(...arg);
    this.append(this.$$.prveEl);
    this.append(this.$$.nextEl);
    addEventListenerOnce(this, "click", this.$$.onClick);
    this.cssList.toggle(this.disabled, "disabled");
  }

  $onDisabledChange() {
    this.cssList.toggle(this.disabled, "disabled");
  }
}
