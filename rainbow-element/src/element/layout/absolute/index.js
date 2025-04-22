import { RainbowElement } from "../../base/index.js";
import "./index.css";

export class RAbsolute extends RainbowElement {
  static observedAttributes = this.$registerProps({
    "r-position": [Boolean, String],
  });

  connectedCallback(...arg) {
    super.connectedCallback(...arg);
    this.$render();
  }

  $onStyleChang(...arg) {
    super.$onChildrenChanage(...arg);
    this.$render();
  }

  $render() {
    let { rPosition } = this.$.DATA;
    this.cssName = `r-absolute-${rPosition}`;
    console.log([this])
  }
}
