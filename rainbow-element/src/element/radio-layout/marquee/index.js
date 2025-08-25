import "./index.scss";
import { RainbowElement } from "../../base/index.js";
import { createElement, createSlot, emptyChildren, copyChildren } from "../../../utils/index.js";
import innerCss from "./index.icss";

export class RMarquee extends RainbowElement {
  $$ = {
    list: createElement("div", "r-marquee-list", "r-marquee-list"),
    copyChildren: createElement("div", "r-marquee-copy-children", "r-marquee-copy-children"),
    defaultSlot: createSlot("slot", "r-marquee-default-slot", ""),
  };

  constructor(...props) {
    super(...props);
    this.attachShadow({ mode: "open" });
    this.$$.list.append(this.$$.defaultSlot, this.$$.copyChildren);
    this.shadowRoot.append(this.$$.list);
  }

  connectedCallback(...arg) {
    super.connectedCallback(...arg);
    this.shadowRoot.appendChild(this.$.styleNode);
    this.innerCss = innerCss;
    this.$render();
  }

  $render() {
    emptyChildren(this.$$.copyChildren);
    this.$$.copyChildren.append(...copyChildren(this));
  }

  $onChildrenChanage(...arg) {
    super.$onChildrenChanage(...arg);
    this.$render();
  }
}
