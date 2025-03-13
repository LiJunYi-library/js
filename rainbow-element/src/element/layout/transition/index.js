import "./index.css";
import { RainbowElement, createElement, createSlot, Transition } from "../../base/index.js";
import {createElement, createSlot, Transition } from "../../../utils/index.js";

export class RTransition extends RainbowElement {
  static observedAttributes = this.$registerProps({
    "r-transition-name": String,
  });

  $$ = (() => {
    const content = createElement("div", "r-dialog-content");
    return {
      value: false,
      content,
      defaultSlot: createSlot("slot", "", ""),
      transition: Transition({
        node: this,
        eventNode: this,
        name: "r-transition",
      }),
    };
  })();

  set value(v) {
    this.$$.value = v;
    if (this.$$.value) this.$$.transition.show();
    else this.$$.transition.hide();
  }

  get value() {
    return this.$$.value;
  }

  constructor(...arg) {
    super(...arg);
    this.attachShadow({ mode: "open" });
    this.$$.content.append(this.$$.defaultSlot);
    this.shadowRoot.appendChild(this.$$.content);
  }

  connectedCallback(...arg) {
    super.connectedCallback(...arg);
    const { rOrientation } = this.$.DATA;
    this.classList.add(`r-dialog-${rOrientation}`);
    if (this.value === false) this.classList.add("r-dialog-hide");
  }

  disconnectedCallback(...arg) {
    super.disconnectedCallback(...arg);
  }
}
