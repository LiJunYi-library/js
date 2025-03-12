import { RainbowElement } from "../../base/index.js";
import "./index.css";

export class RFlex extends RainbowElement {
  static observedAttributes = this.$registerProps({
    // 'direction': { type: String, default: "row" },
    // 'inline': Boolean,
    // 'reverse': Boolean,
    // 'wrap': Boolean,
    // 'justify': { type: String, default: "" },
    // 'align': { type: String, default: "" },
    // 'align-self': { type: String, default: "" },
    // 'auto': { type: [String, Boolean], default: "" },
    // 'fill': { type: [String, Boolean], default: "" },
    "r-gap": { type: Number, default: 0 },
    "r-row-gap": { type: Number, default: 0 },
    "r-column-gap": { type: Number, default: 0 },
  });

  $onRender() {
    let { rGap, rRowGap, rColumnGap } = this.$.DATA;
    let colGap = rColumnGap || rGap || 0;
    let rowGap = rRowGap || rGap || 0;
    this.style["gap"] = rGap + "px";
    this.style["row-gap"] = colGap + "px";
    this.style["column-gap"] = rowGap + "px";
  }
}
