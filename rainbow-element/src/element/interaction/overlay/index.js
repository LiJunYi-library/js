import "./index.css";
import { RainbowElement } from "../../base/index.js";
import { transition } from "../../../utils/index.js";

export class ROverlay extends RainbowElement {
  $$ = (() => {
    return {
      transition: transition({
        node: this,
        dispatchNode: this,
        eventNode: this,
        name: "r-overlay",
        hideName: "r-overlay-hide",
      }),
    };
  })();

  $value = false;

  $onValueChange(bool) {
    if (bool) this.$$.transition.show();
    else this.$$.transition.hide();
  }

  connectedCallback(...arg) {
    super.connectedCallback(...arg);
    if (this.value === false) this.cssList.add("r-overlay-hide");
  }

  disconnectedCallback(...arg) {
    super.disconnectedCallback(...arg);
  }
}
