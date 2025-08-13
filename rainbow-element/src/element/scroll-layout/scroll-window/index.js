import "./index.css";
import { RainbowElement } from "../../base/index.js";
import { createElement, createSlot } from "../../../utils/index.js";
import innerCss from "./index.icss";

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
    this.$$.content.append(this.$$.defaultSlot);
    this.shadowRoot.append(this.$$.topSlot, this.$$.content);
    this.shadowRoot.appendChild(this.$.styleNode);
    this.innerCss = innerCss;
  }

  disconnectedCallback(...arg) {
    super.disconnectedCallback(...arg);
  }
}
