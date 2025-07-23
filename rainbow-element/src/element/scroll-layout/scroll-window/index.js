import "./index.css";
import { RainbowElement } from "../../base/index.js";
import { createCustomEvent, createElement, createSlot } from "../../../utils/index.js";

export class RScrollWindow extends RainbowElement {
  static observedAttributes = this.$registerProps({});

  $$ = {
    scrollView: createElement("div"),
    defaultSlot: createSlot("slot", "r-scroll-window-default-slot", ""),
    topSlot: createSlot("slot", "r-scroll-window-top-slot", "top"),
    content: createElement("div", "r-scroll-window-content"),
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
