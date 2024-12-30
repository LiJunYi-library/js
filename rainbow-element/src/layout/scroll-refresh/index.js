import "./index.css";
import { RainbowElement } from "../../base/index.js";

export class RScrollRefresh extends RainbowElement {
  static observedAttributes = this.$registerProps({
    "r-refresh-heignt": { type: String, default: "0" },
    "r-max-refresh-heignt": { type: String, default: "0" },
    "r-min-time": { type: String, default: "500" },
  });

  $elementName = "RScrollRefresh";

  connectedCallback(...arg) {
    super.connectedCallback(...arg);
    const parent = this.$.findParentByType("RScroll");
    console.log("r-scroll-refresh", [parent]);
    this.classList.add("r-scroll-refresh");
  }

  disconnectedCallback(...arg) {
    super.connectedCallback(...arg);
  }
}

customElements.define("r-scroll-refresh", RScrollRefresh);
