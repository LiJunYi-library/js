import { RainbowElement } from "../base/index.js";
import { addEventListenerOnce, createSlot } from "../../utils/index.js";

export class RAsyncClick extends RainbowElement {
  $$ = {
    loadingSlot: createSlot("slot", "r-dialog-close-loading-slot", "loading"),
    defaultSlot: createSlot("slot", "r-dialog-close-default-slot", ""),
    loadSlot: createSlot("slot", "r-dialog-close-loading-slot", "load"),
    loading: false,
    onclick_: async () => undefined,
    onClick: async (...args) => {
      if (this.$$.loading === true) return;
      this.$$.loading = true;
      this.shadowRoot.insertBefore(this.$$.loadingSlot, this.$$.defaultSlot);
      this.shadowRoot.appendChild(this.$$.loadSlot);
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
      this.shadowRoot.removeChild(this.$$.loadingSlot);
      this.shadowRoot.removeChild(this.$$.loadSlot);
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
    this.shadowRoot.appendChild(this.$$.defaultSlot);
  }

  connectedCallback(...arg) {
    super.connectedCallback(...arg);
    addEventListenerOnce(this, "click", this.$$.onClick);
  }
}
