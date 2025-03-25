import { RainbowElement } from "../../base/index.js";
import "./index.css";

export class RFlex extends RainbowElement {
  static observedAttributes = this.$registerProps({
    "r-gap": { type: Number, default: 0 },
    "r-row-gap": { type: Number, default: 0 },
    "r-column-gap": { type: Number, default: 0 },
  });

  connectedCallback(...arg) {
    super.connectedCallback(...arg);
    this.$onRender();
  }

  $onStyleChang(...arg) {
    super.$onChildrenChanage(...arg);
    this.$onRender();
  }

  $onRender() {
    let { rGap, rRowGap, rColumnGap } = this.$.DATA;
    let colGap = rColumnGap || rGap || 0;
    let rowGap = rRowGap || rGap || 0;
    this.style["gap"] = rGap + "px";
    this.style["row-gap"] = colGap + "px";
    this.style["column-gap"] = rowGap + "px";
  }
}
