import "./index.css";
import { RainbowElement } from "../../base/index.js";
import { transition } from "../../../utils/index.js";

export class ROverlay extends RainbowElement {
  $$ = (() => {
    return {
      value: false,
      transition: transition({
        node: this,
        dispatchNode: this,
        eventNode: this,
        name: "r-overlay",
        hideName: "r-overlay-hide",
      }),
    };
  })();

  set value(v) {
    if (this.$$.value === v) return;
    this.$$.value = v;
    if (this.$$.value) this.$$.transition.show();
    else this.$$.transition.hide();
  }

  get value() {
    return this.$$.value;
  }

  connectedCallback(...arg) {
    super.connectedCallback(...arg);
    if (this.value === false) this.cssList.add("r-overlay-hide");
  }

  disconnectedCallback(...arg) {
    super.disconnectedCallback(...arg);
  }
}
