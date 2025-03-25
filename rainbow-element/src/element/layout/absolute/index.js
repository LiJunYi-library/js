import { RainbowElement } from "../../base/index.js";
import "./index.css";

export class RAbsolute extends RainbowElement {
  static observedAttributes = this.$registerProps({
    "r-position": [Boolean, String],
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
    let { rPosition } = this.$.DATA;
    this.cssName = `r-absolute-${rPosition}`;
    console.log([this])
  }
}
