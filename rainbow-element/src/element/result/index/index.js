import "./index.scss";
import { RainbowElement } from "../../base/index.js";
import { createElement } from "../../../utils/index.js";

export class RResult extends RainbowElement {
  $$ = {
    prveEl: createElement("div", "r-result-prve"),
    textEl: createElement("div", "r-result-text"),
    nextEl: createElement("div", "r-result-next"),
  };

  connectedCallback(...arg) {
    super.connectedCallback(...arg);
    this.append(this.$$.prveEl, this.$$.textEl, this.$$.nextEl);
  }
}
