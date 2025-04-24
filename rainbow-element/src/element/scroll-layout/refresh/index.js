import "./index.css";
import { setTimeoutPromise } from "@rainbow_ljy/rainbow-js";
import { RainbowElement } from "../../base/index.js";
import { createCustomEvent, createElement, createSlot } from "../../../utils/index.js";

export class RRefresh extends RainbowElement {
  static observedAttributes = this.$registerProps({
    "r-refresh-heignt": { type: String, default: "0" },
    "r-max-refresh-heignt": { type: String, default: "0" },
    "r-min-time": { type: String, default: "500" },
  });

  $$ = {
    scrollView: createElement("div"),
    defaultSlot: createSlot("slot", "r-refresh-default-slot", ""),
    topSlot: createSlot("slot", "r-refresh-top-slot", "top"),
    content: createElement("div", "r-refresh-content"),
  };

  constructor(...arg) {
    super(...arg);
  }

  connectedCallback(...arg) {
    super.connectedCallback(...arg);
    this.attachShadow({ mode: "open" });
    this.shadowRoot.appendChild(this.$$.topSlot);
    this.$$.content.appendChild(this.$$.defaultSlot);
    this.shadowRoot.appendChild(this.$$.content);
  }

  disconnectedCallback(...arg) {
    super.disconnectedCallback(...arg);
  }
}
